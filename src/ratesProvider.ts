import * as solace from 'solclientjs';
import { Observable, fromEvent, fromEventPattern, bufferTime, map } from 'rxjs';
// import {  } from 'rxjs/operators';
import RawRate from './models/rawRate';
import { ratesBufferTime } from './myBufferTime';

class RatesProvider {
    private props: any;
    private rawRates: Map<string, object>;
    private session: solace.Session;
    private rates: Observable<any>;

    public constructor() {
        this.props = {
            authenticationScheme: solace.AuthenticationScheme.BASIC,
            url: 'wss://local.solace:1443',
            vpnName: 'default',
            userName: 'client1.messaging.solace.cloud',
            password: 'password123',
            reconnectRetries: 1,
            sslValidateCertificate: false,
            windowSize: 255
        };
        
        this.rawRates = new Map<string, object>();

        this.initSession();

        this.rates = fromEventPattern(
            h => this.session.on(solace.SessionEventCode.MESSAGE, h),
            h => () => {
                // TODO: Find a way to unsubscribe.
            }
        )
            .pipe(map((message: any) => {
                const rate = JSON.parse(message.getBinaryAttachment()) as RawRate;

                return rate;
            }))
            .pipe(ratesBufferTime(5000));
    }

    private initSession() {
        var props = new solace.SessionProperties(this.props);
        props.sslValidateCertificate = true;
        props.sslTrustStores = ['server.crt'];
        props.sslTrustedCommonNameList = ['local.solace'];

        this.session = solace.SolclientFactory.createSession(props);

        this.session.on(solace.SessionEventCode.UP_NOTICE, (sessionEvent: any) => {
            console.log('=== Successfully connected and ready to subscribe. ===');
        });

        this.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, (sessionEvent: any) => {
            console.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });

        this.session.on(solace.SessionEventCode.DISCONNECTED, (sessionEvent: any) => {
            console.log('Disconnected.');
            
            if (this.session !== null) {
                this.session.dispose();
                this.session = null;
            }
        });

        this.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, (sessionEvent: any) => {
            console.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey);
        });

        this.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: any) => {
            console.log('Successfully subscribed to topic: ' + sessionEvent.correlationKey);
            console.log('=== Ready to receive messages. ===');
        });

        // this.session.on(solace.SessionEventCode.MESSAGE, (message: any) => {
        //     var rate = JSON.parse(message.getBinaryAttachment()) as RawRate;

        //     var rateId = `${rate.clientId}-${rate.primary}${rate.secondary}${rate.tenor}`;

        //     this.rawRates.set(rateId, rate);
        // });
    }

    public connect() {
        this.rates.subscribe((rates: Map<string, RawRate>) => {
            console.log(rates);
        });

        this.session.connect();
    }

    public subscribe(topicName: string) {
        if (this.session === null) {
            return;
        }

        console.log('Subscribing to topic: ' + topicName);

        try {
            let destination = solace.SolclientFactory.createTopicDestination(topicName);

            this.session.subscribe(destination,
                true,
                {
                    topicName
                },
                1000
            );
        } catch (error) {
            console.log(error.toString());
        }
    }
}

export default RatesProvider;
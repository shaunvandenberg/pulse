import * as solace from 'solclientjs';
import { Observable, Observer, fromEventPattern, map, tap, share, Subscription } from 'rxjs';
import RawRate from './rawRate';
import { rateStore, RateStore } from './rateStore';

export class RateConsumer implements Observer<RawRate> {
    private store: RateStore;
    private props: any;
    private session: solace.Session;
    private subscription: Subscription;
    
    private rateStream: Observable<RawRate>;

    public getRateStream() : Observable<RawRate> {
        return this.rateStream;
    }

    public constructor(rateStore: RateStore) {
        this.store = rateStore;
        
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

        this.rateStream = fromEventPattern(
                h => this.session.on(solace.SessionEventCode.MESSAGE, h),
                h => () => {
                    // TODO: Find a way to unsubscribe.
                }
            )
            .pipe(map((message: any) => {
                const r = JSON.parse(message.getBinaryAttachment()) as RawRate;

                // TODO: Might not be necessary - I think the rateId might already be populated.
                r.rateId = `${r.clientId}-${r.primary}${r.secondary}${r.tenor}`;
                
                return r;
            }))
            .pipe(share());

        this.initSession();
    }

    private initSession() : void {
        var factoryProps = new solace.SolclientFactoryProperties();
        factoryProps.profile = solace.SolclientFactoryProfiles.version10;
        solace.SolclientFactory
            .init(factoryProps)
            .setLogLevel(solace.LogLevel.INFO);
        
        var props = new solace.SessionProperties(this.props);

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
    }

    public start() : void {
        this.subscription = this.rateStream.subscribe(this);

        this.session.connect();
    }

    public stop() : void {
        this.session.disconnect();

        this.subscription.unsubscribe();
    }

    public subscribe(topicName: string) : void {
        if (this.session === null) {
            return;
        }

        // TODO: Add some validation here. i.e. we don't want to subscribe to same topic twice.

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

    public next(value: RawRate) : void {
        this.store.set(value);
    };

    public error(err: any) : void {
        throw new Error('');
    };

    public complete() : void {

    };

    public destroy() : void {
    }
}

export const rateConsumer = new RateConsumer(rateStore);
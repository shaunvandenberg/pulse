import * as solace from 'solclientjs';
import { Observable, Observer, fromEventPattern, map, filter, share, Subscription } from 'rxjs';
import RawRate from './models/rawRate';
import Ping from './models/ping';
import Pong from './models/pong';
import { rateStore, RateStore } from './data/rateStore';

export interface Message {
    payload: Uint8Array | null;
    ingestionTimestamp: number;
}

export class RateConsumer implements Observer<RawRate> {
    // private PING_TOPIC = 'fx-trading/latency/ping';
    // private PONG_TOPIC = 'fx-trading/latency/pong';
    private PING_TOPIC: string = 'FX_Heartbeat_Request_DEV';
    private PONG_TOPIC: string = 'FX_Heartbeat_Response_DEV';

    private store: RateStore;
    private props: any;
    private session: solace.Session;
    private subscription: Subscription;
    private messageSub: Subscription
    
    private monitorStream: Observable<any>;
    private rateStream: Observable<RawRate>;

    public getRateStream() : Observable<RawRate> {
        return this.rateStream;
    }

    public constructor(rateStore: RateStore) {
        this.store = rateStore;
        
        this.props = {
            authenticationScheme: solace.AuthenticationScheme.BASIC,
            // // url: 'wss://localhost:1443',
            // url: 'ws://localhost:8008',
            // vpnName: 'default',
            // userName: 'client1.messaging.solace.cloud',
            // password: 'password123',
            url: 'ws://mrgjijghtum3r.messaging.solace.cloud:80',
            vpnName: 'cib-rates-stream-non-prod',
            // userName: 'solace-cloud-client',
            userName: 'solace-cloud-client-test01',
            password: 'ni3np37hc07t598anue1vei670',
            // password: '730430986260127744',
            reconnectRetries: 1,
            sslValidateCertificate: false,
            windowSize: 255
        };

        const messageStream: Observable<any> = fromEventPattern(
            h => this.session.on(solace.SessionEventCode.MESSAGE, h),
            h => () => {
                // TODO: Find a way to unsubscribe.
            }
        ).pipe(share());

        this.monitorStream = messageStream.pipe(filter((m: solace.Message) => {
            const destination = m.getDestination();

            return destination && destination.name === this.PING_TOPIC;
        }));

        this.rateStream = messageStream
            .pipe(filter((m: solace.Message) => {
                console.log(m.isElidingEligible());

                const destination = m.getDestination();
    
                return destination && destination.name !== this.PING_TOPIC;
            }))
            .pipe(map((message: solace.Message) => {
                return {
                    payload: message.getBinaryAttachment(),
                    ingestionTimestamp: performance.now()
                };
            }))
            .pipe(map((message: Message) => {
                const r = JSON.parse(message.payload.toString()) as RawRate;

                // TODO: Might not be necessary - I think the rateId might already be populated.
                r.RateId = `${r.ClientId}-${r.Primary}${r.Secondary}${r.Tenor}`;
                r.ingestionTimestamp = message.ingestionTimestamp;
                r.arrivalTime = Date.now();
                
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

            this.subscribe(this.PING_TOPIC);
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
            console.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey.topicName);
        });

        this.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: any) => {
            console.log('Successfully subscribed to topic: ' + sessionEvent.correlationKey.topicName);
            console.log('=== Ready to receive messages. ===');
        });
    }

    private pong(ping: Ping): void {
        if (!this.session) 
        {
            return;
        }

        const pong = {
            ClientId: '123',
            MachineId: 'machineId',
            DispatchedAtUtc: ping.DispatchedAtUtc,
            ArrivalTimeUtc: Date.now()
        };

        const json = JSON.stringify(pong);

        var message = solace.SolclientFactory.createMessage();
        message.setDestination(solace.SolclientFactory.createTopicDestination(this.PONG_TOPIC));
        message.setBinaryAttachment(new TextEncoder().encode(json));
        message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
        
        try {
            this.session.send(message);
            
            console.log('Pong...');
        } catch (error) {
            console.log('Pong failed.');
        }
    }

    public start() : void {
        this.subscription = this.rateStream.subscribe(this);
        this.messageSub = this.monitorStream.subscribe((message: any) => {
            const ping = JSON.parse(message.getBinaryAttachment());

            this.pong(ping);
        });

        this.session.connect();
    }

    public stop() : void {
        this.session.disconnect();

        this.messageSub.unsubscribe();
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
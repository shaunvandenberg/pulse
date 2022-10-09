import * as solace from 'solclientjs';
import { Observable, fromEventPattern, map, share } from 'rxjs';

export interface Session {
    getMessageStream() : Observable<any>;
    subscribe(topicName: string): void;
    connect(): void;
    disconnect(): void;
}

export class Message {
    topicName: string;
    payload: Uint8Array;
    ingestionTimestamp: number;

    constructor(
        topicName: string, 
        payload: Uint8Array, 
        ingestionTimestamp: number) {

        this.topicName = topicName;
        this.payload = payload;
        this.ingestionTimestamp = ingestionTimestamp;
    }
}

export class SolaceSession implements Session {
    private session: solace.Session;

    private messageStream: Observable<Message>;

    public getMessageStream() : Observable<Message> {
        return this.messageStream;
    }

    public constructor() {
        this.messageStream = fromEventPattern(
            h => this.session.on(solace.SessionEventCode.MESSAGE, h),
            h => () => {
                // TODO: Find a way to unsubscribe.
            }
        )
        .pipe(map((m: solace.Message) => {
            const destination = m.getDestination();

            return new Message(destination?.name, m.getBinaryAttachment(), performance.now());
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
        
        var props = new solace.SessionProperties({
            authenticationScheme: solace.AuthenticationScheme.BASIC,
            // // url: 'wss://localhost:1443',
            url: 'ws://localhost:8008',
            vpnName: 'default',
            userName: 'client1.messaging.solace.cloud',
            // password: 'password123',
            // url: 'ws://mrgjijghtum3r.messaging.solace.cloud:80',
            // vpnName: 'cib-rates-stream-non-prod',
            // userName: 'solace-cloud-client',
            // userName: 'solace-cloud-client-test01',
            // password: 'ni3np37hc07t598anue1vei670',
            // password: '730430986260127744',
            reconnectRetries: 3,
            sslValidateCertificate: false
        });

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
            console.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey.topicName);
        });

        this.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, (sessionEvent: any) => {
            console.log('Successfully subscribed to topic: ' + sessionEvent.correlationKey.topicName);
            console.log('=== Ready to receive messages. ===');
        });
    }

    public connect(): void {
        this.session.connect();
    }

    public disconnect(): void {
        this.session.disconnect();
    }

    public subscribe(topicName: string): void {
        if (this.session === null) {

            // TODO: Throw error.
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
            // TODO: Throw custom error.
            console.log(error.toString());
        }
    }

    public request(topicName: string): Promise<any> {
        if (this.session === null) {

            // TODO: Throw error.
            return;
        }
        
        return new Promise((resolve, reject) => {
            var requestText = 'Sample Request';

            var request = solace.SolclientFactory.createMessage();
            request.setDestination(solace.SolclientFactory.createTopicDestination(topicName));
            request.setSdtContainer(solace.SDTField.create(solace.SDTFieldType.STRING, requestText));
            request.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
    
            console.log('Sending request "' + requestText + '" to topic "' + topicName + '"...');
    
            try {
                this.session.sendRequest(
                    request,
                    5000, // 5 seconds timeout for this operation
                    function (_, message) {
                        resolve(message);
                    },
                    function (_, event) {
                        // TODO: Reject with custom error?
                        reject(new Error(event.toString()));
                    },
                    null // not providing correlation object
                );
            } catch (error) {
                console.log('Request failed - ' + error.toString());
            }
        });
    }
}

export const session = new SolaceSession();
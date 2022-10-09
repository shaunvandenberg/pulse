import { session } from './common/messaging/session';
import { rateConsumer } from "./rateConsumer";

export type registerComponents = (registry: Map<string, CustomElementConstructor>) => void;

export class Application {
    private _componentRegistry: Map<string, CustomElementConstructor>;

    public constructor() {
        this._componentRegistry = new Map();
    }

    public registerComponents(registerComponents: registerComponents) : Application {
        registerComponents(this._componentRegistry);

        return this;
    }

    public run() {
        session.connect();
        rateConsumer.start();
        
        this._componentRegistry.forEach((value: CustomElementConstructor, key: string) => {
            window.customElements.define(key, value);
        });
    }
}

export const app = new Application();
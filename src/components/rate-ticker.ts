import { Observer, Observable, Subscription } from 'rxjs';
import { rateBuffer } from '../common/operators/rateButter';
import RateComponent from './rate';
import { rateConsumer } from '../rateConsumer';
import { rateStore } from '../rateStore';
import RawRate from '../rawRate';

const template = document.createElement('template');
template.innerHTML = `
    <section id="rate-ticker">
        Rates...
    </section>
`;

class RateModel {
    public constructor(rateId: string, component: RateComponent) {

    }
}

export default class RateTickerComponent extends HTMLElement implements Observer<Map<string, RawRate>> {
    private _$rateTicker: HTMLElement;
    private _rateStream: Observable<Map<string, RawRate>>;
    private _subscription: Subscription;
    // private _rateConfig: string[];
    // private _rates: Map<string, RateComponent>;
    // private _rateComponents: string[]; 
    private _rates: string[]; 
    
    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));        

        this._$rateTicker = this.shadowRoot.querySelector('#rate-ticker');

        this._rateStream = rateConsumer
            .getRateStream()
            .pipe(rateBuffer(33));

        // this._rates = new Map();
        // this._rateComponents = [];
        this._rates = [];

        this.configureRates();
    }

    private loadRateConfig() : string[] {
        // TODO: Driven off config.
        const rateConfig: string[] = [];
        rateConfig.push('728374356985065472-USDZARSP');
        return rateConfig;
    }

    private configureRates() : void {
        const rateConfig = this.loadRateConfig();

        this._$rateTicker.innerHTML = '';

        this._rates.push('728374356985065472-USDZARSP');
        this._rates.push('728374356985065472-USDZARSP');
        this._rates.push('728374356985065472-USDZARSP');
        this._rates.push('728374356985065472-USDZARSP');
        this._rates.push('728374356985065472-USDZARSP');
        this._rates.push('728374356985065472-USDZARSP');
        this._rates.push('728374356985065472-USDZARSP');
        this._rates.push('728374356985065472-USDZARSP');

        for (let i = 0; i < this._rates.length; i++) {
            const rateId = this._rates[i];
            const rate = rateStore.get(rateId);

            let r = new RateComponent();
            
            if (rate) {
                r.rate = rate; 
            }

            this._$rateTicker.appendChild(r);
        }
    }

    public connectedCallback() {
        this._subscription = this._rateStream.subscribe(this);
    }

    public disconnectedCallback() {
        this._subscription.unsubscribe();
    }
    
    public next(value: Map<string, RawRate>) : void {
        if (!value || value.size == 0) {
            return;
        }

        for (let i = 0; i < this._rates.length; i++) {
            const rateId = this._rates[i];

            const newRate = value.get(rateId);
            if (newRate) {
                const c = this._$rateTicker.childNodes[i] as RateComponent;

                c.rate = newRate;
            } 
        }
    };

    public error(_err: any) : void {
        throw new Error('');
    };

    public complete() : void {

    };
}
import { Observer, Observable, Subscription } from 'rxjs';
import { rateBuffer } from '../common/operators/rateBuffer';
import RateComponent from './rate';
import { rateConsumer } from '../rateConsumer';
import { rateStore } from '../data/rateStore';
import RawRate from '../models/rawRate';

const template = document.createElement('template');
template.innerHTML = `
    <style>
    @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      
      .ticker-item {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        border-right: 1px solid #ddd;
        width: 100%;
        height: 30px;
      }
      
      #maindiv {
        position: relative;
        white-space: nowrap;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;
        animation: fadeIn 2s ease-in;
      }
      
      .marquee {
        display: flex;
        position: absolute;
        overflow: hidden;
        &.paused {
          animation-play-state: paused !important;
          -webkit-animation-play-state: paused !important;
        }
      
        span {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
      }
      
      .ticker {
        display: flex;
        flex-direction: row;
        height: 100%;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.11);
        background: white;
        user-select: none;
        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          color: white;
          height: 100%;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          border: solid 1px #c6002d;
          background-color: #dc0032;
          white-space: nowrap;
          padding: 0 10px;
          .logo {
            width: 32px;
            height: 32px;
            margin-right: 4px;
          }
          .fa-wifi {
            margin-left: 15px;
          }
        }
        &.detached {
          margin: 10px;
          box-shadow: 0px 0px 15px -5px #00000085;
          height: calc(100% - 20px);
          border-radius: 5px;
          overflow: hidden;
          .label {
            -webkit-app-region: drag;
            cursor: move;
          }
        }
        &.offline {
          .label {
            background-color: #444444;
            border-color: #444444;
          }
          #maindiv {
            filter: opacity(0.5) saturate(0) contrast(0);
          }
        }
      }
      
      .setup {
        background-color: #fff;
        font-size: 16px;
        width: 40px;
        min-width: 40px;
        -webkit-box-shadow: -4px 0px 12px -10px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: -4px 0px 12px -10px rgba(0, 0, 0, 0.75);
        box-shadow: -4px 0px 12px -10px rgba(0, 0, 0, 0.75);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .ticker-row {
        display: flex;
        flex-direction: row;
      }

      #rate-ticker {
        display: flex;
        flex-direction: row;
      }
      
    </style>

    <section id="rate-ticker">
        Rates...
    </section>
`;

class RateModel {
    public constructor(rateId: string, component: RateComponent) {

    }
}

const INTERVAL: number = 150;

export default class RateTickerComponent extends HTMLElement implements Observer<Map<string, RawRate>> {
// export default class RateTickerComponent extends HTMLElement implements Observer<RawRate> {
    private _$rateTicker: HTMLElement;
    private _rateStream: Observable<Map<string, RawRate>>;
    // private _rateStream: Observable<RawRate>;
    private _subscription: Subscription;
    // private _rateConfig: string[];
    // private _rates: Map<string, RateComponent>;
    // private _rateComponents: string[]; 
    private _rates: string[]; 
    private _count: number;

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));        

        this._$rateTicker = this.shadowRoot.querySelector('#rate-ticker');

        this._rateStream = rateConsumer
            .getRateStream()
            .pipe(rateBuffer(INTERVAL));

        // this._rates = new Map();
        // this._rateComponents = [];
        this._rates = [];

        this.configureRates();

        this._count = 0;
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
        this._rates.push('728374356985065472-EURZARSP');
        this._rates.push('728374356985065472-ZARJPYSP');
        this._rates.push('728374356985065472-EURUSDSP');
        this._rates.push('728374356985065472-GBPZARSP');
        this._rates.push('728374356985065472-BLABLASP');

        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');
        // this._rates.push('728374356985065472-USDZARSP');

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
                const c = this._$rateTicker.children[i] as RateComponent;

                c.rate = newRate;
            } 
        }
    };

  //   public next(value: RawRate) : void {
  //     for (let i = 0; i < this._rates.length; i++) {
  //         const rateId = this._rates[i];

  //         if (rateId === value.RateId) {
  //             const c = this._$rateTicker.children[i] as RateComponent;

  //             c.rate = value;
  //         } 
  //     }

  //     this._count++;

  //     // console.log(this._count);
  // };

    public error(_err: any) : void {
        throw new Error('');
    };

    public complete() : void {

    };
}
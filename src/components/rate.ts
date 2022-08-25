// import RawRate from "../models/rawRate";
// import currencies from "../data/currencies";

// const rateTemplate = document.createElement('template');
// rateTemplate.innerHTML = `
//     <style>
//         .rate {
//             font-size: 15px;
//             display: flex;
//             flex-direction: row;
//             &:hover {
//                 cursor: pointer;
//             }
//             &.is-empty {
//                 cursor: not-allowed !important;
//             }

//         .red {
//             color: #f60e08;
//             display: flex;
//             align-items: center;
//             &:after {
//                 content: '';
//                 width: 0;
//                 height: 0;
//                 border-left: 5px solid transparent;
//                 border-right: 5px solid transparent;
//                 border-top: 5px solid #f60e08;
//                 margin-bottom: 4px;
//                 margin-left: 3px;
//             }
//         }
        
//         .green {
//             color: #3bb719;
//             display: flex;
//             align-items: center;
//             &:after {
//                 content: '';
//                 width: 0;
//                 height: 0;
//                 border-left: 5px solid transparent;
//                 border-right: 5px solid transparent;
//                 border-bottom: 5px solid #3bb719;
//                 margin-bottom: 4px;
//                 margin-left: 3px;
//             }
//         }
        
//         .currency-pair {
//             margin-right: 10px;
//             margin-left: 10px;
//         }

//         .small-number {
//             margin-right: 1px;
//         }

//         .large-number {
//             vertical-align: text-bottom;
//             font-weight: bold;
//         }
        
//         .rate-row {
//             display: flex;
//             flex-direction: row;
//         }
        
//         .dash {
//             font-size: 18px;
//         }    
//     </style>

//     <span id="rate"></span>
// `;

// export default class RateComponent extends HTMLElement {
//     private _$rate: HTMLLabelElement;
//     private _$elapsed: HTMLLabelElement;
//     private _previousRate: RawRate;
//     private _rate: RawRate;

//     public get rate() : RawRate {
//         return this._rate;
//     }

//     public set rate(value: RawRate) {
//         this._previousRate = this._rate;
//         this._rate = value;

//         this.updateRate(this._rate, this._previousRate);
//     }

//     public constructor() {
//         super();

//         this.attachShadow({ mode: 'open' });
//         this.shadowRoot.appendChild(rateTemplate.content.cloneNode(true));
    
//         this._$rate = this.shadowRoot.querySelector('#rate');
//         this._$elapsed = this.shadowRoot.querySelector('#elapsed');
//     }

//     private updateRate(newRate: RawRate, oldRate: RawRate) {
//         const primary = currencies.get(newRate.primary)?.display || newRate.primary;
//         const counter = currencies.get(newRate.secondary)?.display || newRate.secondary;

//         let isUp = false;
//         let isDown = false;

//         if (oldRate) {
//             isUp = newRate.tiers[0].bid > oldRate.tiers[0].bid;
//             isDown = newRate.tiers[0].bid < oldRate.tiers[0].bid;
//         }

//         this._$rate.innerHTML = `${primary}/${counter} = ${newRate.tiers[0].bid}/${newRate.tiers[0].ask}`;
        
//         if (isUp) {
//             this._$rate.className = 'up';
//         } else if (isDown) {
//             this._$rate.className = 'down';
//         }

//         // this._$elapsed.innerHTML = (performance.now() - newRate.ingestionTimestamp).toString();
//     }

//     public connectedCallback() { 

//     }

//     public disconnectedCallback() {

//     }
// }



import '../styles.css';
import RawRate from "../models/rawRate";
import currencies from "../data/currencies";
import Formatter from "../common/utilities/rateFormatter";

const rateTemplate = document.createElement('template');
rateTemplate.innerHTML = `
    <style>
        .rate {
            font-family: SourceSansPro;
            font-size: 15px;
            display: flex;
            flex-direction: row;
            &:hover {
                cursor: pointer;
            }
            &.is-empty {
                cursor: not-allowed !important;
            }
        }

        .red {
            font-family: SourceSansPro;
            color: #f60e08;
            display: flex;
            align-items: center;
            &:after {
                content: '';
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid #f60e08;
                margin-bottom: 4px;
                margin-left: 3px;
            }
        }
        
        .green {
            font-family: SourceSansPro;
            color: #3bb719;
            display: flex;
            align-items: center;
            &:after {
                content: '';
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 5px solid #3bb719;
                margin-bottom: 4px;
                margin-left: 3px;
            }
        }
        
        .currency-pair {
            align-items: center;
            margin-right: 10px;
            margin-left: 10px;
        }

        .small-number {
            margin-right: 1px;
        }

        .large-number {
            vertical-align: text-bottom;
            font-weight: bold;
        }
        
        .rate-row {
            font-family: SourceSansPro;
            display: flex;
            flex-direction: row;
        }
        
        .dash {
            font-family: SourceSansPro;
            font-size: 18px;
        }
    </style>

    <div class="rate">
        <div class="currency-pair"></div>
        <div class="rate-row">
            <div class="small-number"></div>
            <div class="large-number"></div>
            <div class="dash">/</div>
            <div class="small-number"></div>
            <div class="large-number"></div>
        </div>
    </div>
`;

export default class RateComponent extends HTMLElement {
    private _$rate: HTMLElement;
    private _$currencyPair: HTMLElement;
    private _$smallNumbers: NodeListOf<Element>;
    private _$largeNumbers: NodeListOf<Element>;
    private _$elapsed: HTMLLabelElement;
    private _previousRate: RawRate;
    private _rate: RawRate;
    private _currencyPair: string;

    public get rate() : RawRate {
        return this._rate;
    }

    public set rate(value: RawRate) {
        // TODO: Implement equality check to compare incoming rate changes.
        this._previousRate = this._rate;
        this._rate = value;

        this.updateRate(this._rate, this._previousRate);
    }

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(rateTemplate.content.cloneNode(true));
    
        this._$rate = this.shadowRoot.querySelector('div.rate-row');
        this._$smallNumbers = this.shadowRoot.querySelectorAll('div.small-number');
        this._$largeNumbers = this.shadowRoot.querySelectorAll('div.large-number');
        this._$elapsed = this.shadowRoot.querySelector('#elapsed');
    }

    private getCurrencyPair(rate: RawRate): string {
        const primary = currencies.get(rate.Primary)?.display || rate.Primary;
        const counter = currencies.get(rate.Secondary)?.display || rate.Secondary;
        
        return `${primary}/${counter}`;
    }

    private updateRate(newRate: RawRate, oldRate: RawRate) {
        let isUp = false;
        let isDown = false;

        const currencyPair = this.getCurrencyPair(newRate);

        if (currencyPair !== this._currencyPair) {
            this._$currencyPair = this.shadowRoot.querySelector('div.currency-pair');
            if (this._$currencyPair) {
                this._$currencyPair.innerHTML = `${currencyPair} =`;
            }

            this._currencyPair = currencyPair;
        }

        if (oldRate) {
            // Assuming these are valid rates.
            isUp = newRate.Tiers[0].Bid > oldRate.Tiers[0].Bid;
            isDown = newRate.Tiers[0].Bid < oldRate.Tiers[0].Bid;
        }

        if (isUp) {
            this._$rate.className = 'green';
        } else if (isDown) {
            this._$rate.className = 'red';
        }

        const bid = Formatter.formatRate(currencyPair, newRate.Tiers[0].Bid);
        const ask = Formatter.formatRate(currencyPair, newRate.Tiers[0].Ask);

        this._$smallNumbers[0].innerHTML = bid[0];
        this._$largeNumbers[0].innerHTML = bid[1];
        this._$smallNumbers[1].innerHTML = ask[0];
        this._$largeNumbers[1].innerHTML = ask[1];
    }

    public connectedCallback() { 

    }

    public disconnectedCallback() {

    }
}
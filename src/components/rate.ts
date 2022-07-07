import RawRate from "../rawRate";

const rateTemplate = document.createElement('template');
rateTemplate.innerHTML = `
    <div>
        <span id="label"></span>
    </div>
`;

export default class RateComponent extends HTMLElement {
    private _$label: HTMLLabelElement;
    private _previousRate: RawRate;
    private _rate: RawRate;

    public get rate() : RawRate {
        return this._rate;
    }

    public set rate(value: RawRate) {
        this._previousRate = this._rate;
        this._rate = value;

        this.updateRate(this._rate, this._previousRate);
    }

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(rateTemplate.content.cloneNode(true));
    
        this._$label = this.shadowRoot.querySelector('#label');
    }

    private updateRate(newRate: RawRate, oldRate: RawRate) {
        const tier = newRate.tiers[0];

        this._$label.innerHTML = `${newRate.primary}/${newRate.secondary} = ${tier.bid}/${tier.ask}`;
    }

    public connectedCallback() { 

    }

    public disconnectedCallback() {

    }
}
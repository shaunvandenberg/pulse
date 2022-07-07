import { rateConsumer } from "../rateConsumer";

const template = document.createElement('template');
template.innerHTML = `
    <section id="container">
        <rate-ticker-component></rate-ticker-component>
        <button id="subscribe">Subscribe</button>
    </section>
`;

export default class AppComponent extends HTMLElement {
    private $subscribeButton: HTMLButtonElement;

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.$subscribeButton = this.shadowRoot.querySelector('#subscribe');
    }

    private onSubscribeClick() {
        rateConsumer.subscribe('fx-trading/rates');
    }

    public connectedCallback() {
        this.$subscribeButton.addEventListener('click', this.onSubscribeClick);
    }

    public disconnectedCallback() {
        this.$subscribeButton.removeEventListener('click', this.onSubscribeClick);
    }
}
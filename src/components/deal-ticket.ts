import { session } from '../common/messaging/session';

const template = document.createElement('template');
template.innerHTML = `
    <section id="deal-ticket">
        <button id="subscribe">Book deal</button>
    </section>
`;

export default class DealTicketComponent extends HTMLElement {
    private $bookDealButton: HTMLButtonElement;

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.$bookDealButton = this.shadowRoot.querySelector('#deal-ticket');
    }

    private async onBookDealClick() {
        const response = await session.request('tutorial/trade');

        console.log(response.getBinaryAttachment());
    }

    public connectedCallback() {
        this.$bookDealButton.addEventListener('click', this.onBookDealClick);
    }

    public disconnectedCallback() {
        this.$bookDealButton.removeEventListener('click', this.onBookDealClick);
    }
}
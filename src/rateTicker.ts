class RateTicker {
    private parent: Element;
    private document: Document;

    public constructor(parent: Element, document: Document) {
        this.parent = parent;
        this.document = document;

        this.initComponent(parent, document);
    }

    private initComponent(parent: Element, document: Document) {
        let section = document.createElement('section');

        let ticker = document.createElement('div');
        ticker.className = 'ticker contained';
        
        let label = document.createElement('div');
        label.className = 'label';
        label.innerText = 'Mock FX rates';

        ticker.appendChild(label);

        section.appendChild(ticker);

        parent.appendChild(section);
    }
}

export default RateTicker;
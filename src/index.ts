import './styles.css';
import { app } from './application';
import AppComponent from './components/app';
import RateTickerComponent from './components/rate-ticker';
import RateComponent from './components/rate';
import DealTicketComponent from './components/deal-ticket';

app.registerComponents((r) => {
    r.set('rate-component', RateComponent);
    r.set('app-root', AppComponent);
    r.set('rate-ticker-component', RateTickerComponent);
    r.set('deal-ticket-component', DealTicketComponent);
}).run();
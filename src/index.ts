import './styles.css';
import { app } from './application';
import AppComponent from './components/app';
import RateTickerComponent from './components/rate-ticker';
import RateComponent from './components/rate';

app.registerComponents((r) => {
    r.set('rate-component', RateComponent);
    r.set('app-root', AppComponent);
    r.set('rate-ticker-component', RateTickerComponent);
}).run();
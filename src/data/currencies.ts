import Currency from '../models/currency';

const currencies: Map<string, Currency> = new Map();

currencies.set('ZAR', {
    code: 'ZAR', 
    display: 'ZAR',
    symbol: 'R',
    precision: 2
});
currencies.set('AUD', {
    code: 'AUD', 
    display: 'AUD',
    symbol: '$',
    precision: 2
});
currencies.set('BWP', {
    code: 'BWP', 
    display: 'BWP',
    symbol: 'P',
    precision: 2
});
currencies.set('CAD', {
    code: 'CAD', 
    display: 'CAD',
    symbol: '$',
    precision: 2
});
currencies.set('CHF', {
    code: 'CHF', 
    display: 'CHF',
    symbol: 'Fr',
    precision: 2
});
currencies.set('CNH', {
    code: 'CNH', 
    display: 'CNH',
    symbol: '',
    precision: 6
});
currencies.set('DKK', {
    code: 'DKK', 
    display: 'DKK',
    symbol: 'Kr',
    precision: 6
});

// TODO: Add the rest...
// {"code":"EUR","display":"EUR","symbol":"�","precision":2},{"code":"GBP","display":"GBP","symbol":"�","precision":2},{"code":"GHS","display":"GHS","symbol":"?","precision":2},{"code":"HKD","display":"HKD","symbol":"$","precision":2},{"code":"INR","display":"INR","symbol":"?","precision":2},{"code":"JPY","display":"JPY","symbol":"�","precision":0},{"code":"KES","display":"KES","symbol":"Sh","precision":2},{"code":"MWK","display":"MWK","symbol":"MK","precision":2},{"code":"MUR","display":"MUR","symbol":"?","precision":2},{"code":"MZN","display":"MZN","symbol":"MT","precision":2},{"code":"NAD","display":"NAD","symbol":"$","precision":2},{"code":"NOK","display":"NOK","symbol":"kr","precision":2},{"code":"NZD","display":"NZD","symbol":"$","precision":2},{"code":"SCR","display":"SCR","symbol":"?","precision":2},{"code":"SEK","display":"SEK","symbol":"kr","precision":2},{"code":"SGD","display":"SGD","symbol":"$","precision":2},{"code":"TZS","display":"TZS","symbol":"TSh","precision":2},{"code":"UGX","display":"UGX","symbol":"Sh","precision":2},{"code":"USD","display":"USD","symbol":"$","precision":2},{"code":"ZMW","display":"ZMW","symbol":"ZK","precision":2},{"code":"HUF","display":"HUF","symbol":"FT","precision":2},{"code":"AED","display":"AED","symbol":"?","precision":2},{"code":"CZK","display":"CZK","symbol":"KC?","precision":2},{"code":"ILS","display":"ILS","symbol":"?","precision":2},{"code":"KWD","display":"KWD","symbol":"?","precision":3},{"code":"LSL","display":"LSL","symbol":"L","precision":2},{"code":"MXN","display":"MXN","symbol":"$","precision":2},{"code":"MYR","display":"MYR","symbol":"RM","precision":2},{"code":"NGN","display":"NGN","symbol":"?","precision":2},{"code":"PKR","display":"PKR","symbol":"?","precision":2},{"code":"PLN","display":"PLN","symbol":"?","precision":2},{"code":"QAR","display":"QAR","symbol":"?","precision":2},{"code":"SAR","display":"SAR","symbol":"?","precision":2},{"code":"SZL","display":"SZL","symbol":"L","precision":2},{"code":"THB","display":"THB","symbol":"?","precision":2},{"code":"TRY","display":"TRY","symbol":"�","precision":2}]

export default currencies;
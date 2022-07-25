import * as numeral from 'numeral'

export default class Formatter {
    public static formatRate(_currencyPair: string, value: number): string[] {
        // TODO: Load this from config.
        let format = '0.0000';
        let highlightCount = 2;
        
        const rateString = numeral(value).format(format);
        const small = rateString.slice(0, rateString.length - highlightCount);
        const large = rateString.slice(rateString.length - highlightCount);
    
        return [ small, large ];
    }
}
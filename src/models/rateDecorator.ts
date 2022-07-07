import RawRate from "../rawRate";

export default class RateDecorator {
    private _rate: RawRate;

    public constructor(rate: RawRate) {
        this._rate = rate;
    }
}
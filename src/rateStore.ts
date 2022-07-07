import RawRate from "./rawRate";

export class RateStore {
    private rates: Map<string, RawRate>;

    public constructor() {
        this.rates = new Map();
    }

    public get(rateId: string) {
        return this.rates.get(rateId);
    }

    public set(rate: RawRate) : void {
        this.rates.set(rate.rateId, rate);
    }
}

export const rateStore = new RateStore();;
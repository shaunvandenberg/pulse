import RawTier from "./rawTier";

interface RawRate {
    clientId: string;
    rateId: string;
    valueDate: string;
    primary: string;
    secondary: string;
    tenor: string;
    tiers: Array<RawTier>;
    token: string;
    status: number;
    timestamp: number;
    topic: string;
    liquidityLimitInBaseCcy: number;
    pointMultiplier: number;
    ingestionTimestamp: number;
}

export default RawRate;
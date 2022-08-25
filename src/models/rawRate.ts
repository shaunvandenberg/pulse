import RawTier from "./rawTier";

// interface RawRate {
//     clientId: string;
//     rateId: string;
//     valueDate: string;
//     primary: string;
//     secondary: string;
//     tenor: string;
//     tiers: Array<RawTier>;
//     token: string;
//     status: number;
//     timestamp: number;
//     topic: string;
//     liquidityLimitInBaseCcy: number;
//     pointMultiplier: number;
//     ingestionTimestamp: number;
// }

interface RawRate {
    ClientId: string;
    RateId: string;
    ValueDate: string;
    Primary: string;
    Secondary: string;
    Tenor: string;
    Tiers: Array<RawTier>;
    Token: string;
    status: number;
    Timestamp: number;
    Topic: string;
    LiquidityLimitInBaseCcy: number;
    PointMultiplier: number;
    ingestionTimestamp: number;
    arrivalTime: number
}

export default RawRate;
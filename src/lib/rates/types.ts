export type MarketType = "offshore" | "onshore";

export interface CurrencyPairMeta {
  id: string;
  base: string;
  quote: string;
  displayName: string;
  market: MarketType;
  flag: string;
}

export interface RateTick {
  pairId: string;
  bid: number;
  ask: number;
  spread: number;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePct: number;
  lastUpdated: Date;
  bidDirection: "up" | "down" | "flat";
  askDirection: "up" | "down" | "flat";
}

export type RateSnapshot = Record<string, RateTick>;

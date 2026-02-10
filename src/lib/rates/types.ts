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
  change24h: number;
  change24hPct: number;
  high24h: number;
  low24h: number;
  lastUpdated: Date;
  bidDirection: "up" | "down" | "flat";
  askDirection: "up" | "down" | "flat";
}

export type RateSnapshot = Record<string, RateTick>;

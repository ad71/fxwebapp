import type { RateDataSource } from "./data-source";
import type { RateSnapshot } from "./types";

const BASE_RATES: Record<string, { bid: number; decimals: number }> = {
  "USDINR-OFF":  { bid: 90.5700, decimals: 4 },
  "NDF-USDINR":  { bid: 90.5467, decimals: 4 },
  "USDJPY-OFF":  { bid: 154.273, decimals: 3 },
  "USDCNY-OFF":  { bid: 6.9109, decimals: 4 },
  "CNYINR-OFF":  { bid: 13.0977, decimals: 4 },
  "CHFINR-OFF":  { bid: 117.9700, decimals: 4 },
  "GBPSEK-OFF":  { bid: 13.4861, decimals: 4 },
  "NZDUSD-OFF":  { bid: 0.60492, decimals: 5 },
  "AUDUSD-OFF":  { bid: 0.70786, decimals: 5 },
  "EURINR-OFF":  { bid: 107.7450, decimals: 4 },
  "JPYINR-OFF":  { bid: 0.5869, decimals: 4 },
  "GBPINR-OFF":  { bid: 123.5989, decimals: 4 },
  "EURUSD-OFF":  { bid: 1.19004, decimals: 5 },
  "EURGBP-OFF":  { bid: 0.8717, decimals: 4 },
  "USDINR-ON":   { bid: 90.4200, decimals: 4 },
  "EURINR-ON":   { bid: 107.5100, decimals: 4 },
  "GBPINR-ON":   { bid: 123.2800, decimals: 4 },
  "JPYINR-ON":   { bid: 0.5852, decimals: 4 },
  "USDJPY-ON":   { bid: 154.450, decimals: 3 },
  "EURUSD-ON":   { bid: 1.18850, decimals: 5 },
  "GBPUSD-ON":   { bid: 1.36250, decimals: 5 },
  "AUDUSD-ON":   { bid: 0.70650, decimals: 5 },
  "USDCNY-ON":   { bid: 6.9200, decimals: 4 },
  "USDSGD-ON":   { bid: 1.3285, decimals: 4 },
};

function spreadForPair(bid: number): number {
  if (bid > 100) return 0.01;
  if (bid > 10) return 0.001;
  if (bid > 1) return 0.0001;
  return 0.00003;
}

function randomDelta(bid: number): number {
  const magnitude = bid * 0.00012;
  return (Math.random() - 0.5) * 2 * magnitude;
}

export class MockRateDataSource implements RateDataSource {
  private snapshot: RateSnapshot = {};
  private openPrices: Record<string, number> = {};
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private callback: ((snapshot: RateSnapshot) => void) | null = null;
  private subscribedPairs: string[] = [];

  connect(): void {
    this.initializeSnapshot();
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.callback = null;
    this.subscribedPairs = [];
  }

  subscribe(
    pairIds: string[],
    onTick: (snapshot: RateSnapshot) => void,
  ): void {
    this.subscribedPairs = pairIds;
    this.callback = onTick;

    onTick({ ...this.snapshot });

    // Fast interval, each pair ticks independently with low probability
    this.intervalId = setInterval(() => {
      this.tick();
    }, 200);
  }

  unsubscribe(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.callback = null;
  }

  private initializeSnapshot(): void {
    const now = new Date();

    for (const [pairId, config] of Object.entries(BASE_RATES)) {
      const bid = config.bid;
      const spread = spreadForPair(bid);
      const ask = bid + spread;

      const openDelta = (Math.random() - 0.45) * bid * 0.003;
      const openPrice = bid - openDelta;
      this.openPrices[pairId] = openPrice;

      const change24h = bid - openPrice;
      const change24hPct = (change24h / openPrice) * 100;

      const rangeMagnitude = bid * 0.008;
      const low24h = bid - Math.random() * rangeMagnitude;
      const high24h = bid + Math.random() * rangeMagnitude;

      this.snapshot[pairId] = {
        pairId,
        bid: Number(bid.toFixed(config.decimals)),
        ask: Number(ask.toFixed(config.decimals)),
        spread: Number(spread.toFixed(config.decimals + 1)),
        change24h: Number(change24h.toFixed(config.decimals)),
        change24hPct: Number(change24hPct.toFixed(4)),
        high24h: Number(high24h.toFixed(config.decimals)),
        low24h: Number(low24h.toFixed(config.decimals)),
        lastUpdated: now,
        bidDirection: "flat",
        askDirection: "flat",
      };
    }
  }

  private tick(): void {
    const now = new Date();
    let changed = false;

    // Each subscribed pair independently has a ~8% chance of ticking
    // This means on average ~2 pairs tick per 200ms cycle,
    // but sometimes 0, sometimes 4-5 — organic and random
    for (const pairId of this.subscribedPairs) {
      if (Math.random() > 0.08) continue;

      const prev = this.snapshot[pairId];
      if (!prev) continue;

      const config = BASE_RATES[pairId];
      if (!config) continue;

      const delta = randomDelta(prev.bid);
      const newBid = Number((prev.bid + delta).toFixed(config.decimals));
      const spread = spreadForPair(newBid);
      const newAsk = Number((newBid + spread).toFixed(config.decimals));

      const openPrice = this.openPrices[pairId];
      const change24h = Number((newBid - openPrice).toFixed(config.decimals));
      const change24hPct = Number(((change24h / openPrice) * 100).toFixed(4));

      const high24h = Math.max(prev.high24h, newBid);
      const low24h = Math.min(prev.low24h, newBid);

      this.snapshot[pairId] = {
        pairId,
        bid: newBid,
        ask: newAsk,
        spread: Number(spread.toFixed(config.decimals + 1)),
        change24h,
        change24hPct,
        high24h: Number(high24h.toFixed(config.decimals)),
        low24h: Number(low24h.toFixed(config.decimals)),
        lastUpdated: now,
        bidDirection: newBid > prev.bid ? "up" : newBid < prev.bid ? "down" : "flat",
        askDirection: newAsk > prev.ask ? "up" : newAsk < prev.ask ? "down" : "flat",
      };
      changed = true;
    }

    if (changed) {
      this.callback?.({ ...this.snapshot });
    }
  }
}

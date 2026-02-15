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
  private closePrices: Record<string, number> = {};
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

      // Previous session close — slight offset from current bid
      const closeDelta = (Math.random() - 0.48) * bid * 0.002;
      const close = Number((bid - closeDelta).toFixed(config.decimals));
      this.closePrices[pairId] = close;

      // Today's open — derived from close with small gap
      const openGap = (Math.random() - 0.5) * bid * 0.001;
      const open = Number((close + openGap).toFixed(config.decimals));
      this.openPrices[pairId] = open;

      const change = Number((bid - close).toFixed(config.decimals));
      const changePct = Number(((change / close) * 100).toFixed(4));

      // Session high/low — always encompass current bid and open
      const rangeMagnitude = bid * 0.008;
      const sessionMin = Math.min(bid, open);
      const sessionMax = Math.max(bid, open);
      const low = Number((sessionMin - Math.random() * rangeMagnitude * 0.4).toFixed(config.decimals));
      const high = Number((sessionMax + Math.random() * rangeMagnitude * 0.4).toFixed(config.decimals));

      this.snapshot[pairId] = {
        pairId,
        bid: Number(bid.toFixed(config.decimals)),
        ask: Number(ask.toFixed(config.decimals)),
        spread: Number(spread.toFixed(config.decimals + 1)),
        open,
        high,
        low,
        close,
        change,
        changePct,
        lastUpdated: now,
        bidDirection: "flat",
        askDirection: "flat",
      };
    }
  }

  private tick(): void {
    const now = new Date();
    let changed = false;

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

      const close = this.closePrices[pairId];
      const change = Number((newBid - close).toFixed(config.decimals));
      const changePct = Number(((change / close) * 100).toFixed(4));

      const high = Math.max(prev.high, newBid);
      const low = Math.min(prev.low, newBid);

      this.snapshot[pairId] = {
        pairId,
        bid: newBid,
        ask: newAsk,
        spread: Number(spread.toFixed(config.decimals + 1)),
        open: prev.open,
        high: Number(high.toFixed(config.decimals)),
        low: Number(low.toFixed(config.decimals)),
        close,
        change,
        changePct,
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

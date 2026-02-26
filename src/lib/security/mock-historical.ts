import type { HistoricalCandle } from "./types";

const BASE_RATES: Record<string, number> = {
  "USDINR-OFF": 90.57, "NDF-USDINR": 90.55, "USDJPY-OFF": 154.27,
  "USDCNY-OFF": 6.91, "CNYINR-OFF": 13.10, "CHFINR-OFF": 117.97,
  "GBPSEK-OFF": 13.49, "NZDUSD-OFF": 0.605, "AUDUSD-OFF": 0.708,
  "EURINR-OFF": 107.75, "JPYINR-OFF": 0.587, "GBPINR-OFF": 123.60,
  "EURUSD-OFF": 1.190, "EURGBP-OFF": 0.872,
  "USDINR-ON": 90.42, "EURINR-ON": 107.51, "GBPINR-ON": 123.28,
  "JPYINR-ON": 0.585, "USDJPY-ON": 154.45, "EURUSD-ON": 1.189,
  "GBPUSD-ON": 1.363, "AUDUSD-ON": 0.707, "USDCNY-ON": 6.92,
  "USDSGD-ON": 1.329,
};

function decimalsFor(rate: number): number {
  if (rate > 100) return 4;
  if (rate > 10) return 4;
  if (rate > 1) return 5;
  return 5;
}

// Seeded random for reproducibility per pair
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateHistoricalCandles(
  pairId: string,
  days: number = 365,
): HistoricalCandle[] {
  const base = BASE_RATES[pairId] ?? 1;
  const decimals = decimalsFor(base);
  const rng = seededRandom(hashCode(pairId));

  const candles: HistoricalCandle[] = [];
  let price = base * (0.95 + rng() * 0.1); // Start ~5% around base

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Skip weekends
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    const volatility = base * 0.004;
    const drift = (rng() - 0.48) * volatility * 0.3;
    const open = price;
    const close = Number((open + drift + (rng() - 0.5) * volatility).toFixed(decimals));
    const high = Number((Math.max(open, close) + rng() * volatility * 0.5).toFixed(decimals));
    const low = Number((Math.min(open, close) - rng() * volatility * 0.5).toFixed(decimals));

    candles.push({
      date: date.toISOString().slice(0, 10),
      open: Number(open.toFixed(decimals)),
      high,
      low,
      close,
    });

    price = close;
  }

  return candles;
}

export function filterCandlesByRange(
  candles: HistoricalCandle[],
  range: string,
): HistoricalCandle[] {
  const now = new Date();
  let cutoff: Date;

  switch (range) {
    case "1D": cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 1); break;
    case "1W": cutoff = new Date(now); cutoff.setDate(cutoff.getDate() - 7); break;
    case "1M": cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 1); break;
    case "3M": cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 3); break;
    case "6M": cutoff = new Date(now); cutoff.setMonth(cutoff.getMonth() - 6); break;
    case "1Y": cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 1); break;
    case "5Y": cutoff = new Date(now); cutoff.setFullYear(cutoff.getFullYear() - 5); break;
    default: return candles;
  }

  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return candles.filter((c) => c.date >= cutoffStr);
}

import type { InterestRateCurve } from "./types";

const YIELD_CURVES: Record<string, { base: number; slope: number; source: string }> = {
  USD: { base: 5.33, slope: 0.03, source: "FRED" },
  EUR: { base: 3.75, slope: 0.04, source: "ECB" },
  GBP: { base: 5.15, slope: 0.02, source: "BoE" },
  JPY: { base: 0.10, slope: 0.08, source: "BoJ" },
  INR: { base: 6.50, slope: 0.09, source: "RBI" },
  CNY: { base: 2.20, slope: 0.06, source: "PBoC" },
  AUD: { base: 4.35, slope: 0.03, source: "RBA" },
  NZD: { base: 5.50, slope: 0.02, source: "RBNZ" },
  CHF: { base: 1.75, slope: 0.04, source: "SNB" },
  SEK: { base: 3.50, slope: 0.03, source: "Riksbank" },
  SGD: { base: 3.40, slope: 0.03, source: "MAS" },
};

const TENORS = [
  { tenor: "ON", factor: 1 / 365 },
  { tenor: "1W", factor: 7 / 365 },
  { tenor: "1M", factor: 1 / 12 },
  { tenor: "3M", factor: 3 / 12 },
  { tenor: "6M", factor: 6 / 12 },
  { tenor: "1Y", factor: 1 },
];

export function generateInterestRateCurve(currency: string): InterestRateCurve {
  const config = YIELD_CURVES[currency] ?? { base: 3.0, slope: 0.03, source: "Market" };

  const tenors = TENORS.map(({ tenor, factor }) => ({
    tenor,
    rate: Number((config.base + config.slope * factor * 10 + (Math.random() - 0.5) * 0.05).toFixed(2)),
  }));

  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 4) + 1;
  const asOf = new Date(now.getTime() - hoursAgo * 3600000);

  return {
    currency,
    tenors,
    source: config.source,
    asOf: asOf.toISOString(),
  };
}

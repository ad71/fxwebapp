import type { InterestRateCurve } from "./types";

const YIELD_CURVES: Record<string, { base: number; slope: number; source: string }> = {
  USD: { base: 5.33, slope: 0.030, source: "FRED" },
  EUR: { base: 3.75, slope: 0.028, source: "ECB" },
  GBP: { base: 5.15, slope: 0.022, source: "BoE" },
  JPY: { base: 0.10, slope: 0.020, source: "BoJ" },
  INR: { base: 6.50, slope: 0.040, source: "RBI" },
  CNY: { base: 2.20, slope: 0.025, source: "PBoC" },
  AUD: { base: 4.35, slope: 0.025, source: "RBA" },
  NZD: { base: 5.50, slope: 0.020, source: "RBNZ" },
  CHF: { base: 1.75, slope: 0.025, source: "SNB" },
  SEK: { base: 3.50, slope: 0.022, source: "Riksbank" },
  SGD: { base: 3.40, slope: 0.022, source: "MAS" },
};

// Factor = years to maturity; rate = base + slope-driven sqrt term premium
const TENORS = [
  { tenor: "ON",  factor: 1 / 365 },
  { tenor: "1W",  factor: 7 / 365 },
  { tenor: "1M",  factor: 1 / 12 },
  { tenor: "2M",  factor: 2 / 12 },
  { tenor: "3M",  factor: 3 / 12 },
  { tenor: "6M",  factor: 6 / 12 },
  { tenor: "9M",  factor: 9 / 12 },
  { tenor: "1Y",  factor: 1 },
  { tenor: "2Y",  factor: 2 },
  { tenor: "3Y",  factor: 3 },
  { tenor: "5Y",  factor: 5 },
  { tenor: "10Y", factor: 10 },
];

export function generateInterestRateCurve(currency: string): InterestRateCurve {
  const config = YIELD_CURVES[currency] ?? { base: 3.0, slope: 0.03, source: "Market" };

  const tenors = TENORS.map(({ tenor, factor }) => ({
    tenor,
    // sqrt-based term premium: realistic steepening that tapers at long end
    rate: Number((config.base + config.slope * 3 * Math.sqrt(factor * 3) + (Math.random() - 0.5) * 0.05).toFixed(2)),
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

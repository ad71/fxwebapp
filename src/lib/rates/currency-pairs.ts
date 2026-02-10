import type { CurrencyPairMeta } from "./types";

export const CURRENCY_PAIRS: CurrencyPairMeta[] = [
  // ── Offshore ──
  { id: "USDINR-OFF", base: "USD", quote: "INR", displayName: "USDINR", market: "offshore", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "NDF-USDINR", base: "USD", quote: "INR", displayName: "NDF USDINR", market: "offshore", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "USDJPY-OFF", base: "USD", quote: "JPY", displayName: "USDJPY", market: "offshore", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "USDCNY-OFF", base: "USD", quote: "CNY", displayName: "USDCNY", market: "offshore", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "CNYINR-OFF", base: "CNY", quote: "INR", displayName: "CNYINR", market: "offshore", flag: "\u{1F1E8}\u{1F1F3}" },
  { id: "CHFINR-OFF", base: "CHF", quote: "INR", displayName: "CHFINR", market: "offshore", flag: "\u{1F1E8}\u{1F1ED}" },
  { id: "GBPSEK-OFF", base: "GBP", quote: "SEK", displayName: "GBPSEK", market: "offshore", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "NZDUSD-OFF", base: "NZD", quote: "USD", displayName: "NZDUSD", market: "offshore", flag: "\u{1F1F3}\u{1F1FF}" },
  { id: "AUDUSD-OFF", base: "AUD", quote: "USD", displayName: "AUDUSD", market: "offshore", flag: "\u{1F1E6}\u{1F1FA}" },
  { id: "EURINR-OFF", base: "EUR", quote: "INR", displayName: "EURINR", market: "offshore", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "JPYINR-OFF", base: "JPY", quote: "INR", displayName: "JPYINR", market: "offshore", flag: "\u{1F1EF}\u{1F1F5}" },
  { id: "GBPINR-OFF", base: "GBP", quote: "INR", displayName: "GBPINR", market: "offshore", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "EURUSD-OFF", base: "EUR", quote: "USD", displayName: "EURUSD", market: "offshore", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "EURGBP-OFF", base: "EUR", quote: "GBP", displayName: "EURGBP", market: "offshore", flag: "\u{1F1EA}\u{1F1FA}" },

  // ── Onshore ──
  { id: "USDINR-ON", base: "USD", quote: "INR", displayName: "USDINR", market: "onshore", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "EURINR-ON", base: "EUR", quote: "INR", displayName: "EURINR", market: "onshore", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "GBPINR-ON", base: "GBP", quote: "INR", displayName: "GBPINR", market: "onshore", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "JPYINR-ON", base: "JPY", quote: "INR", displayName: "JPYINR", market: "onshore", flag: "\u{1F1EF}\u{1F1F5}" },
  { id: "USDJPY-ON", base: "USD", quote: "JPY", displayName: "USDJPY", market: "onshore", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "EURUSD-ON", base: "EUR", quote: "USD", displayName: "EURUSD", market: "onshore", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "GBPUSD-ON", base: "GBP", quote: "USD", displayName: "GBPUSD", market: "onshore", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "AUDUSD-ON", base: "AUD", quote: "USD", displayName: "AUDUSD", market: "onshore", flag: "\u{1F1E6}\u{1F1FA}" },
  { id: "USDCNY-ON", base: "USD", quote: "CNY", displayName: "USDCNY", market: "onshore", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "USDSGD-ON", base: "USD", quote: "SGD", displayName: "USDSGD", market: "onshore", flag: "\u{1F1FA}\u{1F1F8}" },
];

export const PAIR_GROUPS: Record<string, string[]> = {
  "INR Pairs": CURRENCY_PAIRS.filter((p) => p.base === "INR" || p.quote === "INR").map((p) => p.id),
  G10: CURRENCY_PAIRS.filter((p) =>
    ["USD", "EUR", "GBP", "JPY", "AUD", "NZD", "CHF", "SEK"].includes(p.base) &&
    ["USD", "EUR", "GBP", "JPY", "AUD", "NZD", "CHF", "SEK"].includes(p.quote)
  ).map((p) => p.id),
  EM: CURRENCY_PAIRS.filter((p) =>
    ["INR", "CNY", "SGD"].some((c) => p.base === c || p.quote === c)
  ).map((p) => p.id),
};

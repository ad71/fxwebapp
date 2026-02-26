/**
 * Centralized formatting functions for financial figures.
 * Ensures consistent decimal places and locale-aware separators.
 */

const numFmt = new Intl.NumberFormat("en-US");
const compactFmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function formatRate(n: number, decimals = 4): string {
  return n.toFixed(decimals);
}

export function formatPercent(n: number, decimals = 2): string {
  const prefix = n >= 0 ? "+" : "";
  return `${prefix}${n.toFixed(decimals)}%`;
}

export function formatCurrency(n: number, ccy: string): string {
  return `${ccy} ${numFmt.format(n)}`;
}

export function formatCompact(n: number): string {
  return compactFmt.format(n);
}

export function formatNumber(n: number, decimals?: number): string {
  if (decimals !== undefined) {
    return numFmt.format(parseFloat(n.toFixed(decimals)));
  }
  return numFmt.format(n);
}

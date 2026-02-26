import type { MovingAverage, TechnicalSignal } from "./types";
import type { HistoricalCandle } from "./types";

function sma(candles: HistoricalCandle[], period: number): number {
  const slice = candles.slice(-period);
  if (slice.length === 0) return 0;
  return slice.reduce((sum, c) => sum + c.close, 0) / slice.length;
}

export function generateMovingAverages(
  candles: HistoricalCandle[],
  currentRate: number,
): MovingAverage[] {
  const periods = [7, 30, 90, 200];

  return periods.map((period) => {
    const value = Number(sma(candles, period).toFixed(4));
    const diff = currentRate - value;
    const threshold = currentRate * 0.001;
    const signal: MovingAverage["signal"] =
      diff > threshold ? "buy" : diff < -threshold ? "sell" : "neutral";

    return { period, value, signal };
  });
}

export function generateTechnicalSignals(currentRate: number): TechnicalSignal[] {
  // RSI: 0-100, >70 overbought (sell), <30 oversold (buy), else neutral
  const rsi = 30 + Math.random() * 50;
  const rsiSignal: TechnicalSignal["signal"] =
    rsi > 65 ? "sell" : rsi < 35 ? "buy" : "neutral";

  // MACD: positive = buy, negative = sell, near zero = neutral
  const macd = (Math.random() - 0.45) * 0.02;
  const macdSignal: TechnicalSignal["signal"] =
    macd > 0.003 ? "buy" : macd < -0.003 ? "sell" : "neutral";

  // Stochastic %K: 0-100
  const stoch = 20 + Math.random() * 60;
  const stochSignal: TechnicalSignal["signal"] =
    stoch > 75 ? "sell" : stoch < 25 ? "buy" : "neutral";

  return [
    { indicator: "RSI(14)", value: Number(rsi.toFixed(2)), signal: rsiSignal },
    { indicator: "MACD", value: Number(macd.toFixed(4)), signal: macdSignal },
    { indicator: "Stoch %K", value: Number(stoch.toFixed(2)), signal: stochSignal },
  ];
}

export function generatePivotPoints(
  high: number,
  low: number,
  close: number,
): Record<string, number> {
  const pivot = (high + low + close) / 3;
  return {
    R3: Number((pivot + 2 * (high - low)).toFixed(4)),
    R2: Number((pivot + (high - low)).toFixed(4)),
    R1: Number((2 * pivot - low).toFixed(4)),
    P: Number(pivot.toFixed(4)),
    S1: Number((2 * pivot - high).toFixed(4)),
    S2: Number((pivot - (high - low)).toFixed(4)),
    S3: Number((pivot - 2 * (high - low)).toFixed(4)),
  };
}

"use client";

import { useMemo } from "react";
import { CURRENCY_PAIRS } from "../rates/currency-pairs";
import { useLiveRates } from "../rates/use-live-rates";
import { generateHistoricalCandles } from "./mock-historical";
import { generateForwardRates } from "./mock-forward-rates";
import { generateCalendarData } from "./mock-forward-calendar";
import { generateInterestRateCurve } from "./mock-interest-rates";
import {
  generateMovingAverages,
  generateTechnicalSignals,
  generatePivotPoints,
} from "./mock-technical";
import { generatePositions } from "./mock-positions";
import { generateRules } from "./mock-rules";
import type { SecurityPageData } from "./types";

export function useSecurityData(pairId: string): SecurityPageData | null {
  const pair = useMemo(
    () => CURRENCY_PAIRS.find((p) => p.id === pairId) ?? null,
    [pairId],
  );

  const { rates } = useLiveRates(pair ? [pair.id] : []);
  const spot = pair ? rates[pair.id] ?? null : null;

  const staticData = useMemo(() => {
    if (!pair || !spot) return null;

    const historical = generateHistoricalCandles(pairId, 365);
    const lastCandle = historical[historical.length - 1];

    return {
      historical,
      forwardRates: generateForwardRates(spot.bid),
      calendar: generateCalendarData(spot.bid),
      domesticCurve: generateInterestRateCurve(pair.base),
      foreignCurve: generateInterestRateCurve(pair.quote),
      technicals: {
        movingAverages: generateMovingAverages(historical, spot.bid),
        signals: generateTechnicalSignals(spot.bid),
        pivotPoints: lastCandle
          ? generatePivotPoints(lastCandle.high, lastCandle.low, lastCandle.close)
          : {},
      },
      positions: generatePositions(pairId),
      rules: generateRules(pair.displayName, spot.bid),
      performance: {
        "1D": Number(((Math.random() - 0.45) * 0.3).toFixed(2)),
        "1W": Number(((Math.random() - 0.45) * 1.2).toFixed(2)),
        "1M": Number(((Math.random() - 0.45) * 2.5).toFixed(2)),
        "3M": Number(((Math.random() - 0.45) * 5.0).toFixed(2)),
        "6M": Number(((Math.random() - 0.45) * 8.0).toFixed(2)),
        "1Y": Number(((Math.random() - 0.45) * 12.0).toFixed(2)),
        "5Y": Number(((Math.random() - 0.3) * 25.0).toFixed(2)),
        Max: Number(((Math.random() - 0.2) * 35.0).toFixed(2)),
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairId, !!spot]);

  if (!pair || !spot || !staticData) return null;

  return {
    pair,
    spot,
    ...staticData,
  };
}

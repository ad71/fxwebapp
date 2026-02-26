"use client";

import * as React from "react";
import type { MovingAverage, TechnicalSignal } from "../../lib/security/types";
import { Badge } from "../ui/badge";
import { cn } from "../ui/cn";
import styles from "./technical-summary.module.css";

interface TechnicalSummaryProps {
  technicals: {
    movingAverages: MovingAverage[];
    signals: TechnicalSignal[];
    pivotPoints: Record<string, number>;
  };
}

const SIGNAL_VARIANT = {
  buy: "success",
  sell: "danger",
  neutral: "neutral",
} as const;

const SIGNAL_LABEL = {
  buy: "Buy",
  sell: "Sell",
  neutral: "Neutral",
} as const;

function countSignals(items: Array<{ signal: "buy" | "sell" | "neutral" }>) {
  let buy = 0;
  let sell = 0;
  let neutral = 0;
  for (const item of items) {
    if (item.signal === "buy") buy++;
    else if (item.signal === "sell") sell++;
    else neutral++;
  }
  return { buy, sell, neutral };
}

export function TechnicalSummary({ technicals }: TechnicalSummaryProps) {
  const { movingAverages, signals } = technicals;

  const maCounts = countSignals(movingAverages);
  const sigCounts = countSignals(signals);

  const totalBuy = maCounts.buy + sigCounts.buy;
  const totalSell = maCounts.sell + sigCounts.sell;
  const totalNeutral = maCounts.neutral + sigCounts.neutral;
  const total = totalBuy + totalSell + totalNeutral;

  let overall: "buy" | "sell" | "neutral" = "neutral";
  if (totalBuy > totalSell && totalBuy > totalNeutral) overall = "buy";
  else if (totalSell > totalBuy && totalSell > totalNeutral) overall = "sell";

  const buyPct = total > 0 ? (totalBuy / total) * 100 : 0;
  const neutralPct = total > 0 ? (totalNeutral / total) * 100 : 0;
  const sellPct = total > 0 ? (totalSell / total) * 100 : 0;

  return (
    <div className={styles.grid}>
      {/* Panel 1 — Moving Averages */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Moving Averages</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Period</th>
                <th className={styles.numCol}>Value</th>
                <th className={styles.signalCol}>Signal</th>
              </tr>
            </thead>
            <tbody>
              {movingAverages.map((ma) => (
                <tr key={ma.period}>
                  <td>SMA {ma.period}</td>
                  <td className={styles.numCol}>{ma.value.toFixed(4)}</td>
                  <td className={styles.signalCol}>
                    <Badge variant={SIGNAL_VARIANT[ma.signal]}>
                      {SIGNAL_LABEL[ma.signal]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel 2 — Technical Indicators */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Technical Indicators</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Indicator</th>
                <th className={styles.numCol}>Value</th>
                <th className={styles.signalCol}>Signal</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((sig) => (
                <tr key={sig.indicator}>
                  <td>{sig.indicator}</td>
                  <td className={styles.numCol}>{sig.value.toFixed(4)}</td>
                  <td className={styles.signalCol}>
                    <Badge variant={SIGNAL_VARIANT[sig.signal]}>
                      {SIGNAL_LABEL[sig.signal]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel 3 — Summary Gauge */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Summary</h3>
        </div>
        <div className={styles.gaugeBody}>
          <p className={styles.overallLabel}>Overall Signal</p>
          <p
            className={cn(
              styles.overallSignal,
              overall === "buy" && styles.signalBuy,
              overall === "sell" && styles.signalSell,
              overall === "neutral" && styles.signalNeutral,
            )}
          >
            {SIGNAL_LABEL[overall].toUpperCase()}
          </p>

          <ul className={styles.breakdownList}>
            <li className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Moving Averages:</span>
              <span>
                {maCounts.buy} Buy, {maCounts.sell} Sell, {maCounts.neutral}{" "}
                Neutral
              </span>
            </li>
            <li className={styles.breakdownItem}>
              <span className={styles.breakdownLabel}>Indicators:</span>
              <span>
                {sigCounts.buy} Buy, {sigCounts.neutral} Neutral,{" "}
                {sigCounts.sell} Sell
              </span>
            </li>
          </ul>

          {/* Stacked bar */}
          <div className={styles.barContainer}>
            <div className={styles.barBuy} style={{ width: `${buyPct}%` }} />
            <div
              className={styles.barNeutral}
              style={{ width: `${neutralPct}%` }}
            />
            <div className={styles.barSell} style={{ width: `${sellPct}%` }} />
          </div>

          <div className={styles.barLegend}>
            <span>
              <span
                className={cn(styles.legendDot, styles.legendDotBuy)}
              />
              Buy ({totalBuy})
            </span>
            <span>
              <span
                className={cn(styles.legendDot, styles.legendDotNeutral)}
              />
              Neutral ({totalNeutral})
            </span>
            <span>
              <span
                className={cn(styles.legendDot, styles.legendDotSell)}
              />
              Sell ({totalSell})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

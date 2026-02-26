"use client";

import * as React from "react";
import type { ForwardRate } from "../../lib/security/types";
import { Button } from "../ui/button";
import { Field, Input } from "../ui/input";
import { cn } from "../ui/cn";
import styles from "./hedging-calculator.module.css";

interface HedgingCalculatorProps {
  spotRate: number;
  forwardRates: ForwardRate[];
}

interface CalculationResult {
  forwardRate: number;
  forwardPoints: number;
  annualizedPremiumPct: number;
  hedgingCost: number;
  settlementDate: string;
}

/**
 * Interpolate a forward rate for the given target date from the sorted
 * forward rates array. Uses linear interpolation between the two nearest
 * tenors. If the target is before the first tenor, the first tenor values
 * are used; if after the last, the last tenor values are used.
 */
function interpolate(
  targetDate: string,
  forwardRates: ForwardRate[],
  amount: number,
): CalculationResult | null {
  if (forwardRates.length === 0) return null;

  const target = new Date(targetDate).getTime();
  const sorted = [...forwardRates].sort(
    (a, b) =>
      new Date(a.settlementDate).getTime() -
      new Date(b.settlementDate).getTime(),
  );

  // Clamp: before first tenor
  if (target <= new Date(sorted[0].settlementDate).getTime()) {
    const r = sorted[0];
    return {
      forwardRate: r.forwardRate,
      forwardPoints: r.forwardPoints,
      annualizedPremiumPct: r.annualizedPremiumPct,
      hedgingCost: amount * (r.hedgingCostPct / 100),
      settlementDate: r.settlementDate,
    };
  }

  // Clamp: after last tenor
  const last = sorted[sorted.length - 1];
  if (target >= new Date(last.settlementDate).getTime()) {
    return {
      forwardRate: last.forwardRate,
      forwardPoints: last.forwardPoints,
      annualizedPremiumPct: last.annualizedPremiumPct,
      hedgingCost: amount * (last.hedgingCostPct / 100),
      settlementDate: last.settlementDate,
    };
  }

  // Find surrounding tenors
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    const tA = new Date(a.settlementDate).getTime();
    const tB = new Date(b.settlementDate).getTime();

    if (target >= tA && target <= tB) {
      const ratio = (target - tA) / (tB - tA);
      const fwdRate = a.forwardRate + ratio * (b.forwardRate - a.forwardRate);
      const fwdPts =
        a.forwardPoints + ratio * (b.forwardPoints - a.forwardPoints);
      const annPrem =
        a.annualizedPremiumPct +
        ratio * (b.annualizedPremiumPct - a.annualizedPremiumPct);
      const hedgePct =
        a.hedgingCostPct + ratio * (b.hedgingCostPct - a.hedgingCostPct);

      return {
        forwardRate: fwdRate,
        forwardPoints: fwdPts,
        annualizedPremiumPct: annPrem,
        hedgingCost: amount * (hedgePct / 100),
        settlementDate: targetDate,
      };
    }
  }

  return null;
}

function fmtRate(v: number): string {
  if (v >= 100) return v.toFixed(4);
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(5);
}

function fmtPoints(v: number): string {
  return v >= 0 ? `+${v.toFixed(4)}` : v.toFixed(4);
}

function fmtPct(v: number): string {
  return `${v.toFixed(2)}%`;
}

function fmtUsd(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function HedgingCalculator({
  spotRate,
  forwardRates,
}: HedgingCalculatorProps) {
  const [targetDate, setTargetDate] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [result, setResult] = React.useState<CalculationResult | null>(null);

  const handleCalculate = () => {
    if (!targetDate || !amount) return;
    const numAmount = parseFloat(amount);
    if (Number.isNaN(numAmount) || numAmount <= 0) return;

    const calc = interpolate(targetDate, forwardRates, numAmount);
    setResult(calc);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Quick Forward Calculator</h3>
      </div>

      <div className={styles.body}>
        <div className={styles.inputs}>
          <Field label="Target Date">
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </Field>
          <Field label="Amount">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.amountInput}
              min={0}
            />
          </Field>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleCalculate}
          disabled={!targetDate || !amount}
        >
          Calculate
        </Button>

        <div className={styles.results}>
          {result === null ? (
            <p className={styles.placeholder}>
              Enter date and amount to calculate
            </p>
          ) : (
            <dl className={styles.resultGrid}>
              <div className={styles.resultRow}>
                <dt className={styles.resultLabel}>Forward Rate</dt>
                <dd className={styles.resultValue}>{fmtRate(result.forwardRate)}</dd>
              </div>
              <div className={styles.resultRow}>
                <dt className={styles.resultLabel}>Forward Points</dt>
                <dd className={styles.resultValue}>{fmtPoints(result.forwardPoints)}</dd>
              </div>
              <div className={styles.resultRow}>
                <dt className={styles.resultLabel}>Premium (ann.)</dt>
                <dd className={styles.resultValue}>{fmtPct(result.annualizedPremiumPct)}</dd>
              </div>
              <div className={styles.resultRow}>
                <dt className={styles.resultLabel}>Hedging Cost</dt>
                <dd className={styles.resultValue}>{fmtUsd(result.hedgingCost)}</dd>
              </div>
              <div className={styles.resultRow}>
                <dt className={styles.resultLabel}>Settlement</dt>
                <dd className={styles.resultValue}>{result.settlementDate}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

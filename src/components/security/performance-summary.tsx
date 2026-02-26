"use client";

import styles from "./performance-summary.module.css";
import { cn } from "../ui/cn";

interface PerformanceSummaryProps {
  performance: Record<string, number>;
}

const PERIODS = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "Max"];

export function PerformanceSummary({ performance }: PerformanceSummaryProps) {
  return (
    <div className={styles.row}>
      {PERIODS.map((p) => {
        const val = performance[p] ?? 0;
        const isPositive = val >= 0;
        return (
          <div key={p} className={styles.pill}>
            <span className={styles.period}>{p}</span>
            <span
              className={cn(
                styles.value,
                isPositive ? styles.positive : styles.negative,
              )}
            >
              {isPositive ? "+" : ""}
              {val.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

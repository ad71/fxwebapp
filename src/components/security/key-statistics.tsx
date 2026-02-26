"use client";

import type { RateTick, CurrencyPairMeta } from "../../lib/rates/types";
import { StatCard } from "../ui/stat-card";
import styles from "./key-statistics.module.css";

interface KeyStatisticsProps {
  spot: RateTick;
  pair: CurrencyPairMeta;
}

function fmt(v: number): string {
  if (v >= 100) return v.toFixed(4);
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(5);
}

export function KeyStatistics({ spot }: KeyStatisticsProps) {
  return (
    <div className={styles.grid}>
      <StatCard label="Prev. Close" value={fmt(spot.close)} />
      <StatCard label="Open" value={fmt(spot.open)} />
      <StatCard label="Bid" value={fmt(spot.bid)} />
      <StatCard label="Ask" value={fmt(spot.ask)} />
      <StatCard label="Day's Range" value={`${fmt(spot.low)} — ${fmt(spot.high)}`} />
      <StatCard
        label="52wk Range"
        value={`${fmt(spot.low * 0.97)} — ${fmt(spot.high * 1.01)}`}
      />
      <StatCard label="Day Volume" value="1.24B" subValue="(est.)" />
      <StatCard label="Avg Volume" value="980M" subValue="20-day avg" />
    </div>
  );
}

"use client";

import * as React from "react";
import type { CurrencyPairMeta, RateTick } from "../../lib/rates/types";
import type { ForwardRate } from "../../lib/security/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sparkline } from "../ui/sparkline";
import { RangeBar } from "../rates/range-bar";
import { Star, Bell, Calculator } from "lucide-react";
import styles from "./security-hero.module.css";

interface SecurityHeroProps {
  pair: CurrencyPairMeta;
  spot: RateTick;
  forwardRates: ForwardRate[];
  weekRange52?: { low: number; high: number };
  condensed?: boolean;
}

function formatRate(v: number): string {
  if (v >= 100) return v.toFixed(4);
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(5);
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function SecurityHero({
  pair,
  spot,
  forwardRates,
  weekRange52,
  condensed = false,
}: SecurityHeroProps) {
  const isPositive = spot.change >= 0;
  const sparkData = forwardRates
    .filter((f) => !f.isMonthEnd)
    .map((f) => f.forwardRate);

  const w52 = weekRange52 ?? {
    low: spot.low * 0.97,
    high: spot.high * 1.01,
  };

  if (condensed) {
    return (
      <div className={styles.condensed}>
        <span className={styles.condensedFlag}>{pair.flag}</span>
        <span className={styles.condensedName}>
          {pair.base}/{pair.quote}
        </span>
        <span className={styles.condensedRate}>{formatRate(spot.bid)}</span>
        <span className={isPositive ? styles.condensedUp : styles.condensedDown}>
          {isPositive ? "▲" : "▼"} {spot.changePct >= 0 ? "+" : ""}
          {spot.changePct.toFixed(2)}%
        </span>
      </div>
    );
  }

  return (
    <div
      className={styles.hero}
      style={{ viewTransitionName: `rate-row-${pair.id}` } as React.CSSProperties}
    >
      <div className={styles.top}>
        <div className={styles.identity}>
          <span className={styles.flag}>{pair.flag}</span>
          <h1 className={styles.pairName}>
            {pair.base}/{pair.quote}
          </h1>
          <Badge variant={pair.market === "offshore" ? "info" : "neutral"}>
            {pair.market === "offshore" ? "Offshore" : "Onshore"}
          </Badge>
        </div>

        <div className={styles.freshness}>
          <span className={styles.liveDot} />
          Live &middot; {formatTime(spot.lastUpdated)}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.rateBlock}>
          <div className={styles.mainRate}>{formatRate(spot.bid)}</div>
          <div className={isPositive ? styles.changeUp : styles.changeDown}>
            <span>{isPositive ? "▲" : "▼"}</span>
            <span>
              {spot.change >= 0 ? "+" : ""}
              {spot.change.toFixed(4)}
            </span>
            <span>
              ({spot.changePct >= 0 ? "+" : ""}
              {spot.changePct.toFixed(2)}%)
            </span>
          </div>
          <div className={styles.bidAsk}>
            Bid {formatRate(spot.bid)} · Ask {formatRate(spot.ask)} · Spread{" "}
            {spot.spread.toFixed(4)}
          </div>
        </div>

        <div className={styles.sparkBlock}>
          <span className={styles.sparkLabel}>Forward Curve</span>
          {sparkData.length > 2 && (
            <Sparkline
              data={sparkData}
              width={140}
              height={44}
              color="var(--color-brand-500)"
              fillColor="var(--color-brand-400)"
            />
          )}
        </div>
      </div>

      <div className={styles.ranges}>
        <div className={styles.rangeItem}>
          <span className={styles.rangeLabel}>Day&apos;s Range</span>
          <RangeBar low={spot.low} high={spot.high} current={spot.bid} />
        </div>
        <div className={styles.rangeItem}>
          <span className={styles.rangeLabel}>52wk Range</span>
          <RangeBar low={w52.low} high={w52.high} current={spot.bid} />
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" size="sm">
          <Star size={14} />
          Watchlist
        </Button>
        <Button variant="secondary" size="sm">
          <Bell size={14} />
          Create Alert
        </Button>
        <Button variant="secondary" size="sm">
          <Calculator size={14} />
          Calc Forward
        </Button>
      </div>
    </div>
  );
}

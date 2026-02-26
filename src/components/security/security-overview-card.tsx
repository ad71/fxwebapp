"use client";

import * as React from "react";
import type { CurrencyPairMeta, RateTick } from "../../lib/rates/types";
import type { ForwardRate } from "../../lib/security/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sparkline } from "../ui/sparkline";
import { RangeBar } from "../rates/range-bar";
import { Star, Bell, Calculator } from "lucide-react";
import styles from "./security-overview-card.module.css";

export interface SecurityOverviewCardProps {
  pair: CurrencyPairMeta;
  spot: RateTick;
  forwardRates: ForwardRate[];
  performance: Record<string, number>;
}

const PERF_PERIODS = ["1D", "1W", "1M", "3M", "6M", "1Y", "5Y", "Max"];

function formatRate(v: number): string {
  if (v >= 100) return v.toFixed(4);
  if (v >= 1) return v.toFixed(4);
  return v.toFixed(5);
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

type FlashState = "idle" | "flash" | "fade";
type FlashDir = "up" | "down";

export function SecurityOverviewCard({
  pair,
  spot,
  forwardRates,
  performance,
}: SecurityOverviewCardProps) {
  const isPositive = spot.change >= 0;

  const sparkData = forwardRates
    .filter((f) => !f.isMonthEnd)
    .map((f) => f.forwardRate);

  const w52 = { low: spot.low * 0.97, high: spot.high * 1.01 };

  // Smooth directional flash: snap to green/red instantly, ease back over 750ms
  const prevBidRef = React.useRef(spot.bid);
  const [flashState, setFlashState] = React.useState<FlashState>("idle");
  const [flashDir, setFlashDir] = React.useState<FlashDir>("up");
  const flashTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const rafRef = React.useRef<number>(undefined);

  React.useEffect(() => {
    if (prevBidRef.current !== spot.bid) {
      clearTimeout(flashTimerRef.current);
      cancelAnimationFrame(rafRef.current!);

      // Determine direction before updating the ref
      setFlashDir(spot.bid > prevBidRef.current ? "up" : "down");
      setFlashState("flash"); // instant colour snap, no transition

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setFlashState("fade"); // CSS transition eases back to ink-900
          flashTimerRef.current = setTimeout(
            () => setFlashState("idle"),
            750,
          );
        });
      });

      prevBidRef.current = spot.bid;
    }
    return () => {
      clearTimeout(flashTimerRef.current);
      cancelAnimationFrame(rafRef.current!);
    };
  }, [spot.bid]);

  const rateClass = [
    styles.mainRate,
    flashState === "flash"
      ? flashDir === "up"
        ? styles.mainRateFlashUp
        : styles.mainRateFlashDown
      : "",
    flashState === "fade" ? styles.mainRateFade : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.card}>
      {/* ── Row 1: Header ── */}
      <div className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.flag}>{pair.flag}</span>
          <h1 className={styles.pairName}>
            {pair.base}/{pair.quote}
          </h1>
          <Badge variant={pair.market === "offshore" ? "info" : "neutral"}>
            {pair.market === "offshore" ? "Offshore" : "Onshore"}
          </Badge>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.freshness}>
            <span className={styles.liveDot} />
            Live &middot; {formatTime(spot.lastUpdated)}
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" size="sm">
              <Star size={14} />
              Watchlist
            </Button>
            <Button variant="secondary" size="sm">
              <Bell size={14} />
              Alert
            </Button>
            <Button variant="secondary" size="sm">
              <Calculator size={14} />
              Calc Forward
            </Button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Rate (left) + Context — sparkline + ranges (right) ── */}
      <div className={styles.rateRow}>
        {/* Left — price */}
        <div className={styles.rateBlock}>
          <div className={rateClass}>{formatRate(spot.bid)}</div>
          <div className={isPositive ? styles.changeUp : styles.changeDown}>
            <span className={styles.changeArrow}>{isPositive ? "▲" : "▼"}</span>
            <span>
              {spot.change >= 0 ? "+" : ""}
              {spot.change.toFixed(4)}
            </span>
            <span className={styles.changePct}>
              ({spot.changePct >= 0 ? "+" : ""}
              {spot.changePct.toFixed(2)}%)
            </span>
          </div>
          <div className={styles.bidAsk}>
            Bid {formatRate(spot.bid)} &middot; Ask {formatRate(spot.ask)}
          </div>
        </div>

        {/* Right — ranges (left, stacked) + forward curve sparkline (right) */}
        <div className={styles.contextBlock}>
          <div className={styles.rangesStack}>
            <div className={styles.rangeItem}>
              <span className={styles.rangeLabel}>Day&apos;s Range</span>
              <RangeBar low={spot.low} high={spot.high} current={spot.bid} />
            </div>
            <div className={styles.rangeItem}>
              <span className={styles.rangeLabel}>52-Week Range</span>
              <RangeBar low={w52.low} high={w52.high} current={spot.bid} />
            </div>
          </div>
          {sparkData.length > 2 && (
            <div className={styles.sparkSection}>
              <span className={styles.contextLabel}>Forward Curve</span>
              <Sparkline
                data={sparkData}
                width={130}
                height={64}
                color="var(--color-brand-500)"
                fillColor="var(--color-brand-400)"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Row 3: Stats strip ── */}
      <div className={styles.statsStrip}>
        {(
          [
            { label: "Prev. Close", value: formatRate(spot.close) },
            { label: "Open", value: formatRate(spot.open) },
            { label: "Bid", value: formatRate(spot.bid) },
            { label: "Ask", value: formatRate(spot.ask) },
            { label: "Day Volume", value: "1.24B", sub: "est." },
            { label: "Avg Volume", value: "980M", sub: "20-day avg" },
          ] as { label: string; value: string; sub?: string }[]
        ).map(({ label, value, sub }, i) => (
          <div
            key={label}
            className={styles.statItem}
            style={{ animationDelay: `${i * 25}ms` }}
          >
            <span className={styles.statLabel}>{label}</span>
            <div className={styles.statValueRow}>
              <span className={styles.statValue}>{value}</span>
              {sub && <span className={styles.statSub}>{sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 4: Performance pills ── */}
      <div className={styles.perfRow}>
        {PERF_PERIODS.map((p) => {
          const val = performance[p] ?? 0;
          const pos = val >= 0;
          return (
            <div key={p} className={styles.perfPill}>
              <span className={styles.perfPeriod}>{p}</span>
              <span className={pos ? styles.perfPos : styles.perfNeg}>
                {pos ? "+" : ""}
                {val.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

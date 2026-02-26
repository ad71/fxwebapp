"use client";

import { memo, useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import type { CurrencyPairMeta, RateTick } from "../../lib/rates/types";
import { CurrencyPairCell } from "./currency-pair-cell";
import { Tooltip } from "../ui/tooltip";
import { useViewTransition } from "../../hooks/use-view-transition";
import styles from "./rates-table.module.css";

interface RateRowProps {
  pair: CurrencyPairMeta;
  tick: RateTick;
  index?: number;
  onDragStart: (e: React.DragEvent, pairId: string) => void;
  onDragOver: (e: React.DragEvent, pairId: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, pairId: string) => void;
  isDragging: boolean;
  isDragOver: boolean;
}

function formatRate(value: number, pair: CurrencyPairMeta): string {
  if (pair.base === "JPY" || pair.quote === "JPY") {
    if (value > 1) return value.toFixed(3);
    return value.toFixed(4);
  }
  if (value >= 100) return value.toFixed(4);
  if (value >= 10) return value.toFixed(4);
  if (value >= 1) return value.toFixed(5);
  return value.toFixed(5);
}

function formatSpread(value: number): string {
  return value.toFixed(5);
}

function formatChange(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}${value.toFixed(4)}`;
}

function formatChangePct(value: number): string {
  const prefix = value >= 0 ? "+" : "";
  return `(${prefix}${value.toFixed(4)}%)`;
}

function formatTimestamp(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${d} ${h}:${m}:${s}`;
}

function formatFullTimestamp(date: Date): string {
  return (
    date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    formatTimestamp(date)
  );
}

function RateRowInner({
  pair,
  tick,
  index = 0,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOver,
}: RateRowProps) {
  const { navigate } = useViewTransition();
  const gripActivatedRef = useRef(false);
  const prevBidRef = useRef(tick.bid);
  const prevAskRef = useRef(tick.ask);
  const [bidAnim, setBidAnim] = useState(0);
  const [askAnim, setAskAnim] = useState(0);
  const [bidDir, setBidDir] = useState<"up" | "down" | "flat">("flat");
  const [askDir, setAskDir] = useState<"up" | "down" | "flat">("flat");
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    if (tick.bid !== prevBidRef.current) {
      setBidDir(tick.bid > prevBidRef.current ? "up" : "down");
      setBidAnim((p) => p + 1);
      prevBidRef.current = tick.bid;
    }
    if (tick.ask !== prevAskRef.current) {
      setAskDir(tick.ask > prevAskRef.current ? "up" : "down");
      setAskAnim((p) => p + 1);
      prevAskRef.current = tick.ask;
    }
  }, [tick.bid, tick.ask]);

  const isPositive = tick.change >= 0;

  // Apply entrance animation only on first render
  const showEntrance = !hasEnteredRef.current;
  useEffect(() => {
    hasEnteredRef.current = true;
  }, []);

  const rowClass = [
    styles.row,
    showEntrance ? styles.rowEnter : "",
    isDragging ? styles.rowDragging : "",
    isDragOver ? styles.rowDragOver : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/security/${pair.id}`);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!gripActivatedRef.current) {
      e.preventDefault();
      return;
    }
    onDragStart(e as any, pair.id);
  };

  return (
    <a
      href={`/security/${pair.id}`}
      className={rowClass}
      style={{
        ...(showEntrance ? { "--row-enter-delay": `${index * 40}ms` } as React.CSSProperties : {}),
        viewTransitionName: `rate-row-${pair.id}`,
      } as React.CSSProperties}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragOver={(e) => onDragOver(e as any, pair.id)}
      onDragEnd={() => { gripActivatedRef.current = false; onDragEnd(); }}
      onDrop={(e) => onDrop(e as any, pair.id)}
    >
      <div className={styles.pairCell}>
        <div
          className={styles.dragHandle}
          onMouseDown={() => { gripActivatedRef.current = true; }}
          onMouseUp={() => { gripActivatedRef.current = false; }}
        >
          <div className={styles.gripDots}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.gripDot} />
            ))}
          </div>
        </div>
        <CurrencyPairCell pair={pair} />
      </div>

      <div className={styles.priceCol}>
        <span
          key={`bid-${bidAnim}`}
          className={
            bidDir !== "flat"
              ? styles[`flash${bidDir === "up" ? "Up" : "Down"}`]
              : undefined
          }
        >
          {formatRate(tick.bid, pair)}
        </span>
      </div>

      <div className={styles.priceCol}>
        <span
          key={`ask-${askAnim}`}
          className={
            askDir !== "flat"
              ? styles[`flash${askDir === "up" ? "Up" : "Down"}`]
              : undefined
          }
        >
          {formatRate(tick.ask, pair)}
        </span>
      </div>

      <div className={styles.spreadCol}>{formatSpread(tick.spread)}</div>

      <div
        className={`${styles.changeCol} ${styles.cellSep} ${isPositive ? styles.changePositive : styles.changeNegative}`}
      >
        <span className={styles.changeArrow}>
          {isPositive ? "\u25B2" : "\u25BC"}
        </span>
        <span>{formatChange(tick.change)}</span>
        <span className={styles.changePct}>
          {formatChangePct(tick.changePct)}
        </span>
      </div>

      <div className={`${styles.ohlcCol} ${styles.cellSep}`}>{formatRate(tick.open, pair)}</div>
      <div className={styles.ohlcCol}>{formatRate(tick.high, pair)}</div>
      <div className={styles.ohlcCol}>{formatRate(tick.low, pair)}</div>
      <div className={styles.ohlcCol}>{formatRate(tick.close, pair)}</div>

      {/* Day Range: inline track showing close position within [low, high] */}
      {(() => {
        const range = tick.high - tick.low;
        const pos = range > 0 ? Math.max(0, Math.min(100, ((tick.close - tick.low) / range) * 100)) : 50;
        return (
          <div className={styles.rangeCol}>
            <div className={styles.rangeTrack}>
              <div className={styles.rangeFill} style={{ width: `${pos}%` }} />
              <div className={styles.rangeDot} style={{ left: `${pos}%` }} />
            </div>
          </div>
        );
      })()}

      <Tooltip content={formatFullTimestamp(tick.lastUpdated)}>
        <div className={`${styles.timeCol} ${styles.cellSep}`}>
          {formatTimestamp(tick.lastUpdated)}
          <ChevronRight size={14} className={styles.rowChevron} />
        </div>
      </Tooltip>
    </a>
  );
}

export const RateRow = memo(RateRowInner, (prev, next) => {
  return (
    prev.tick.bid === next.tick.bid &&
    prev.tick.ask === next.tick.ask &&
    prev.tick.change === next.tick.change &&
    prev.tick.high === next.tick.high &&
    prev.tick.low === next.tick.low &&
    prev.tick.lastUpdated === next.tick.lastUpdated &&
    prev.isDragging === next.isDragging &&
    prev.isDragOver === next.isDragOver &&
    prev.index === next.index
  );
});

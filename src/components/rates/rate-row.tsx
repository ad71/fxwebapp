"use client";

import { memo, useRef, useState, useEffect } from "react";
import type { CurrencyPairMeta, RateTick } from "../../lib/rates/types";
import { CurrencyPairCell } from "./currency-pair-cell";
import { RangeBar } from "./range-bar";
import styles from "./rates-table.module.css";

interface RateRowProps {
  pair: CurrencyPairMeta;
  tick: RateTick;
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

function relativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function RateRowInner({
  pair,
  tick,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOver,
}: RateRowProps) {
  const prevBidRef = useRef(tick.bid);
  const prevAskRef = useRef(tick.ask);
  const [bidAnim, setBidAnim] = useState(0);
  const [askAnim, setAskAnim] = useState(0);
  const [bidDir, setBidDir] = useState<"up" | "down" | "flat">("flat");
  const [askDir, setAskDir] = useState<"up" | "down" | "flat">("flat");
  const [, setTimeRefresh] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => setTimeRefresh((p) => p + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const isPositive = tick.change24h >= 0;

  const rowClass = [
    styles.row,
    isDragging ? styles.rowDragging : "",
    isDragOver ? styles.rowDragOver : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rowClass}
      draggable
      onDragStart={(e) => onDragStart(e, pair.id)}
      onDragOver={(e) => onDragOver(e, pair.id)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, pair.id)}
    >
      <div className={styles.pairCell}>
        <div className={styles.dragHandle}>
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
        className={`${styles.changeCol} ${isPositive ? styles.changePositive : styles.changeNegative}`}
      >
        <span className={styles.changeArrow}>
          {isPositive ? "\u2197" : "\u2198"}
        </span>
        <span>{formatChange(tick.change24h)}</span>
        <span className={styles.changePct}>
          {formatChangePct(tick.change24hPct)}
        </span>
      </div>

      <div className={styles.rangeCol}>
        <RangeBar low={tick.low24h} high={tick.high24h} current={tick.bid} />
      </div>

      <div className={styles.timeCol}>{relativeTime(tick.lastUpdated)}</div>
    </div>
  );
}

export const RateRow = memo(RateRowInner, (prev, next) => {
  return (
    prev.tick.bid === next.tick.bid &&
    prev.tick.ask === next.tick.ask &&
    prev.tick.change24h === next.tick.change24h &&
    prev.tick.high24h === next.tick.high24h &&
    prev.tick.low24h === next.tick.low24h &&
    prev.isDragging === next.isDragging &&
    prev.isDragOver === next.isDragOver
  );
});

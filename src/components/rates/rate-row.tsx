"use client";

import { memo, useRef, useState, useEffect } from "react";
import type { CurrencyPairMeta, RateTick } from "../../lib/rates/types";
import { CurrencyPairCell } from "./currency-pair-cell";
import { Tooltip } from "../ui/tooltip";
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

function formatTimestamp(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
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
    const timer = setInterval(() => setTimeRefresh((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const isPositive = tick.change >= 0;

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

      <Tooltip content={formatFullTimestamp(tick.lastUpdated)}>
        <div className={`${styles.timeCol} ${styles.cellSep}`}>{formatTimestamp(tick.lastUpdated)}</div>
      </Tooltip>
    </div>
  );
}

export const RateRow = memo(RateRowInner, (prev, next) => {
  return (
    prev.tick.bid === next.tick.bid &&
    prev.tick.ask === next.tick.ask &&
    prev.tick.change === next.tick.change &&
    prev.tick.high === next.tick.high &&
    prev.tick.low === next.tick.low &&
    prev.isDragging === next.isDragging &&
    prev.isDragOver === next.isDragOver
  );
});

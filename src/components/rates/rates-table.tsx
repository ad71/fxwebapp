"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { SearchX } from "lucide-react";
import type { CurrencyPairMeta, RateSnapshot } from "../../lib/rates/types";
import { RateRow } from "./rate-row";
import styles from "./rates-table.module.css";

interface RatesTableProps {
  pairs: CurrencyPairMeta[];
  rates: RateSnapshot;
}

function loadOrder(key: string): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveOrder(key: string, order: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(order));
}

export function RatesTable({ pairs, rates }: RatesTableProps) {
  const storageKey = "rates-row-order";
  const [customOrder, setCustomOrder] = useState<string[] | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const initialized = useRef(false);

  // Load saved order once on mount
  useEffect(() => {
    if (!initialized.current) {
      const saved = loadOrder(storageKey);
      if (saved) setCustomOrder(saved);
      initialized.current = true;
    }
  }, []);

  // Sort pairs by custom order if it exists
  const orderedPairs = customOrder
    ? [...pairs].sort((a, b) => {
        const ai = customOrder.indexOf(a.id);
        const bi = customOrder.indexOf(b.id);
        // Pairs not in saved order go to the end
        const aIdx = ai === -1 ? Infinity : ai;
        const bIdx = bi === -1 ? Infinity : bi;
        return aIdx - bIdx;
      })
    : pairs;

  const handleDragStart = useCallback(
    (e: React.DragEvent, pairId: string) => {
      setDraggedId(pairId);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", pairId);
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, pairId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverId(pairId);
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData("text/plain");
      if (!sourceId || sourceId === targetId) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const currentIds = orderedPairs.map((p) => p.id);
      const sourceIdx = currentIds.indexOf(sourceId);
      const targetIdx = currentIds.indexOf(targetId);
      if (sourceIdx === -1 || targetIdx === -1) return;

      const newOrder = [...currentIds];
      newOrder.splice(sourceIdx, 1);
      newOrder.splice(targetIdx, 0, sourceId);

      setCustomOrder(newOrder);
      saveOrder(storageKey, newOrder);
      setDraggedId(null);
      setDragOverId(null);
    },
    [orderedPairs],
  );

  return (
    <div className={styles.tableWrap}>
      <div className={styles.header}>
        <span>Currency Pair</span>
        <span>Bid</span>
        <span>Ask</span>
        <span>Spread</span>
        <span className={styles.headerSep}>Day Change</span>
        <span className={styles.headerSep}>Open</span>
        <span>High</span>
        <span>Low</span>
        <span>Close</span>
        <span>Day Range</span>
        <span className={styles.headerSep}>Updated</span>
      </div>
      <div className={styles.body}>
        {orderedPairs.map((pair, i) => {
          const tick = rates[pair.id];
          if (!tick) return null;
          return (
            <RateRow
              key={pair.id}
              pair={pair}
              tick={tick}
              index={i}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              isDragging={draggedId === pair.id}
              isDragOver={dragOverId === pair.id && draggedId !== pair.id}
            />
          );
        })}
        {orderedPairs.length === 0 && (
          <div className={styles.empty}>
            <SearchX size={40} strokeWidth={1.25} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>No currency pairs found</p>
            <p className={styles.emptyHint}>Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

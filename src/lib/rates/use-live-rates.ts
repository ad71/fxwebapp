"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { RateSnapshot } from "./types";
import type { RateDataSource } from "./data-source";
import { createDataSource } from "./create-data-source";

export function useLiveRates(pairIds: string[]) {
  const [rates, setRates] = useState<RateSnapshot>({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastTick, setLastTick] = useState<Date | null>(null);
  const sourceRef = useRef<RateDataSource | null>(null);

  const handleTick = useCallback((snapshot: RateSnapshot) => {
    setRates(snapshot);
    setLastTick(new Date());
  }, []);

  // Stable serialized key so the effect only re-runs when the actual set changes
  const pairKey = useMemo(() => [...pairIds].sort().join(","), [pairIds]);

  useEffect(() => {
    const source = createDataSource("mock");
    sourceRef.current = source;

    source.connect();
    setIsConnected(true);
    source.subscribe(pairKey.split(","), handleTick);

    return () => {
      source.unsubscribe();
      source.disconnect();
      setIsConnected(false);
      sourceRef.current = null;
    };
  }, [pairKey, handleTick]);

  return { rates, isConnected, lastTick };
}

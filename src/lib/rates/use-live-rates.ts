"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

  useEffect(() => {
    const source = createDataSource("mock");
    sourceRef.current = source;

    source.connect();
    setIsConnected(true);
    source.subscribe(pairIds, handleTick);

    return () => {
      source.unsubscribe();
      source.disconnect();
      setIsConnected(false);
      sourceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rates, isConnected, lastTick };
}

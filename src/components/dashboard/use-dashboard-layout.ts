"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { DashboardLayout, DashboardState } from "./widget-types";
import { getDefaultState, DASHBOARD_VERSION } from "./default-layouts";

const PERSIST_DELAY = 500;

function storageKey(dashboardId: string) {
  return `dashboard-layout-${dashboardId}`;
}

function loadState(dashboardId: string): DashboardState {
  if (typeof window === "undefined") return getDefaultState();

  try {
    const raw = localStorage.getItem(storageKey(dashboardId));
    if (!raw) return getDefaultState();
    const parsed: DashboardState = JSON.parse(raw);
    if (parsed.version !== DASHBOARD_VERSION) return getDefaultState();
    return parsed;
  } catch {
    return getDefaultState();
  }
}

export function useDashboardLayout(dashboardId: string) {
  const [state, setState] = useState<DashboardState>(() =>
    loadState(dashboardId)
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced persist to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      localStorage.setItem(storageKey(dashboardId), JSON.stringify(state));
    }, PERSIST_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dashboardId, state]);

  const onLayoutChange = useCallback((layouts: DashboardLayout) => {
    setState((prev) => ({ ...prev, layouts }));
  }, []);

  const resetLayout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey(dashboardId));
    }
    setState(getDefaultState());
  }, [dashboardId]);

  return { state, onLayoutChange, resetLayout };
}

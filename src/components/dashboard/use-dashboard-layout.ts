"use client";

import { useState, useCallback, useEffect } from "react";
import type { Layout } from "react-grid-layout";
import type { DashboardState } from "./widget-types";
import { getDefaultState, DASHBOARD_VERSION } from "./default-layouts";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey(dashboardId), JSON.stringify(state));
  }, [dashboardId, state]);

  const onLayoutChange = useCallback((layouts: Layout) => {
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

import type { WidgetConfig, DashboardLayout, DashboardState } from "./widget-types";

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "settlements-tomorrow", type: "settlements-tomorrow", title: "Tomorrow's settlements", minW: 3, minH: 3 },
  { id: "settlements-next", type: "settlements-next", title: "03 Feb 2026 settlements", minW: 3, minH: 3 },
  { id: "var", type: "var", title: "Lifetime VaR Saved", minW: 2, minH: 3 },
  { id: "payments", type: "payments", title: "Upcoming payments", minW: 4, minH: 3 },
  { id: "hedge-ratio", type: "hedge-ratio", title: "Your hedge ratio", minW: 3, minH: 2 },
  { id: "balances", type: "balances", title: "Your balances", minW: 3, minH: 3 },
  { id: "recent-trades", type: "recent-trades", title: "Recent trades", minW: 4, minH: 4 },
  { id: "performance", type: "performance", title: "Performance", minW: 3, minH: 4 },
];

export const DEFAULT_LAYOUTS: DashboardLayout = [
  { i: "settlements-tomorrow", x: 0, y: 0, w: 5, h: 4, minW: 3, minH: 3 },
  { i: "settlements-next", x: 5, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "var", x: 9, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
  { i: "payments", x: 0, y: 4, w: 8, h: 4, minW: 4, minH: 3 },
  { i: "hedge-ratio", x: 8, y: 4, w: 4, h: 2, minW: 3, minH: 2 },
  { i: "balances", x: 8, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "recent-trades", x: 0, y: 8, w: 8, h: 5, minW: 4, minH: 4 },
  { i: "performance", x: 8, y: 8, w: 4, h: 5, minW: 3, minH: 4 },
];

export const DASHBOARD_VERSION = 1;

export function getDefaultState(): DashboardState {
  return {
    layouts: DEFAULT_LAYOUTS,
    widgets: DEFAULT_WIDGETS,
    version: DASHBOARD_VERSION,
  };
}

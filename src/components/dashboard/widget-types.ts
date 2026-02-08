import type { Layout } from "react-grid-layout";

export type WidgetType =
  | "settlements-tomorrow"
  | "settlements-next"
  | "var"
  | "payments"
  | "hedge-ratio"
  | "balances"
  | "recent-trades"
  | "performance";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface DashboardState {
  layouts: Layout;
  widgets: WidgetConfig[];
  version: number;
}

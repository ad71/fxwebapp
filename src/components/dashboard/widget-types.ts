import type { Layout } from "react-grid-layout";

/** Layout is already `readonly LayoutItem[]` in react-grid-layout v2. */
export type DashboardLayout = Layout;

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
  layouts: DashboardLayout;
  widgets: WidgetConfig[];
  version: number;
}

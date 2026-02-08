import { lazy } from "react";
import type { WidgetType } from "./widget-types";

export const widgetRegistry: Record<
  WidgetType,
  React.LazyExoticComponent<React.ComponentType>
> = {
  "settlements-tomorrow": lazy(() => import("./widgets/settlements-widget")),
  "settlements-next": lazy(() => import("./widgets/settlements-next-widget")),
  var: lazy(() => import("./widgets/var-widget")),
  payments: lazy(() => import("./widgets/payments-widget")),
  "hedge-ratio": lazy(() => import("./widgets/hedge-ratio-widget")),
  balances: lazy(() => import("./widgets/balances-widget")),
  "recent-trades": lazy(() => import("./widgets/recent-trades-widget")),
  performance: lazy(() => import("./widgets/performance-widget")),
};

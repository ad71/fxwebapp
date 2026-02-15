"use client";

import { Suspense } from "react";
import {
  Responsive,
  useContainerWidth,
} from "react-grid-layout";
import type { ResponsiveLayouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Widget } from "./widget";
import { widgetRegistry } from "./widget-registry";
import { useDashboardLayout } from "./use-dashboard-layout";
import { Skeleton } from "../ui/skeleton";
import styles from "./widget-grid.module.css";
import type { WidgetType } from "./widget-types";

function WidgetSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton style={{ height: 16, width: "40%", marginBottom: 12 }} />
      <Skeleton style={{ height: 12, width: "70%", marginBottom: 8 }} />
      <Skeleton style={{ height: 12, width: "55%" }} />
    </div>
  );
}

function WidgetContent({ type }: { type: WidgetType }) {
  const Component = widgetRegistry[type];
  return (
    <Suspense fallback={<WidgetSkeleton />}>
      <Component />
    </Suspense>
  );
}

export function WidgetGrid({ dashboardId }: { dashboardId: string }) {
  const { state, onLayoutChange, resetLayout } =
    useDashboardLayout(dashboardId);
  const { width, containerRef, mounted } = useContainerWidth({
    initialWidth: 1200,
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <button className={styles.resetBtn} onClick={resetLayout}>
          Reset layout
        </button>
      </div>
      <div ref={containerRef} className={styles.container}>
        {mounted && (
          <Responsive
            width={width}
            layouts={{ lg: state.layouts } as ResponsiveLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
            rowHeight={60}
            margin={[20, 20] as const}
            dragConfig={{ enabled: true, handle: ".widget-drag-handle", bounded: false, threshold: 3 }}
            onLayoutChange={(layout) => onLayoutChange(layout)}
          >
            {state.widgets.map((w, i) => (
              <div key={w.id}>
                <Widget title={w.title} style={{ "--widget-enter-delay": `${i * 60}ms` } as React.CSSProperties}>
                  <WidgetContent type={w.type} />
                </Widget>
              </div>
            ))}
          </Responsive>
        )}
      </div>
    </div>
  );
}

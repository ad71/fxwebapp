import * as React from "react";
import { cn } from "../ui/cn";
import styles from "./widget.module.css";

export interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
}

export const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ title, children, className, style, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.widget, className)} style={style} {...rest}>
      <div className={styles.header}>
        <div className={`${styles.dragHandle} widget-drag-handle`}>
          <div className={styles.gripDots}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={styles.gripDot} />
            ))}
          </div>
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
);

Widget.displayName = "Widget";

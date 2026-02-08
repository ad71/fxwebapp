import * as React from "react";
import styles from "./badge.module.css";
import { cn } from "./cn";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => (
    <span ref={ref} className={cn(styles.badge, styles[variant], className)} {...props} />
  )
);

Badge.displayName = "Badge";

import * as React from "react";
import styles from "./stat-card.module.css";
import { cn } from "./cn";

export interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: "up" | "down" | "flat";
  mono?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  mono = true,
  className,
}) => (
  <div className={cn(styles.card, className)}>
    <span className={styles.label}>{label}</span>
    <span className={cn(styles.value, mono && styles.mono, trend && styles[trend])}>
      {value}
    </span>
    {subValue && <span className={styles.sub}>{subValue}</span>}
  </div>
);

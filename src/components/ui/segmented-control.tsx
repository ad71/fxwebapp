"use client";

import * as React from "react";
import styles from "./segmented-control.module.css";
import { cn } from "./cn";

export interface SegmentedControlOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  size = "md",
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeIdx = options.findIndex((o) => o.value === value);
    const buttons = container.querySelectorAll("button");
    const btn = buttons[activeIdx];
    if (btn) {
      setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className={cn(styles.container, styles[size], className)}
      role="radiogroup"
    >
      <div
        className={styles.indicator}
        style={{ left: indicator.left, width: indicator.width }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          className={cn(styles.option, opt.value === value && styles.active)}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

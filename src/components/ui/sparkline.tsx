import * as React from "react";
import styles from "./sparkline.module.css";
import { cn } from "./cn";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  color = "var(--color-brand-500)",
  fillColor,
  className,
}) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padding = 2;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * plotW;
    const y = padding + plotH - ((v - min) / range) * plotH;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;

  const fillPath = fillColor
    ? `${linePath} L${padding + plotW},${padding + plotH} L${padding},${padding + plotH} Z`
    : undefined;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn(styles.sparkline, className)}
      aria-hidden="true"
    >
      {fillPath && (
        <path d={fillPath} fill={fillColor} opacity={0.15} />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

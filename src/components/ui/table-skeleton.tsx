import * as React from "react";
import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export function TableSkeleton({ rows = 5, cols = 6 }: TableSkeletonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Header row */}
      <div style={{ display: "flex", gap: "var(--spacing-12)", padding: "var(--spacing-12) var(--spacing-20)" }}>
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton
            key={`h-${i}`}
            style={{
              height: 10,
              flex: i === 0 ? 1.4 : 1,
              borderRadius: "var(--radius-4)",
            }}
          />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }, (_, r) => (
        <div
          key={r}
          style={{
            display: "flex",
            gap: "var(--spacing-12)",
            padding: "var(--spacing-12) var(--spacing-20)",
            borderTop: "1px solid var(--color-border-subtle)",
          }}
        >
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton
              key={`${r}-${c}`}
              style={{
                height: 14,
                flex: c === 0 ? 1.4 : 1,
                borderRadius: "var(--radius-4)",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

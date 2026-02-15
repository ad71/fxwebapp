/**
 * Skeleton — Animated loading placeholder with shimmer effect.
 *
 * @usage Set width/height via className or style to match the content it replaces.
 * @a11y Animation disabled when `prefers-reduced-motion: reduce` is active.
 */
import * as React from "react";
import styles from "./skeleton.module.css";
import { cn } from "./cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(styles.skeleton, className)} {...props} />
  )
);

Skeleton.displayName = "Skeleton";

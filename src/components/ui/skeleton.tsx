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

/**
 * Tooltip — Non-interactive overlay that appears on hover/focus.
 *
 * @usage Wrap any element; pass `content` string for the tooltip text.
 *   Use for supplementary info, not critical content.
 * @a11y Uses `role="tooltip"`. Visible on both hover and keyboard focus.
 */
import * as React from "react";
import styles from "./tooltip.module.css";
import { cn } from "./cn";

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, className, children }) => {
  return (
    <span className={cn(styles.wrapper, className)}>
      {children}
      <span className={styles.tooltip} role="tooltip">
        {content}
      </span>
    </span>
  );
};

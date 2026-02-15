/**
 * Button — Primary interactive element for all clickable actions.
 *
 * @usage Use `primary` for main CTAs, `secondary` for supporting actions,
 *   `ghost` for subtle/inline actions, `danger` for destructive operations.
 * @a11y Spinner is `aria-hidden`; button is disabled while loading.
 */
import * as React from "react";
import styles from "./button.module.css";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          styles.button,
          styles[variant],
          styles[size],
          loading && styles.loading,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className={styles.spinner} aria-hidden />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

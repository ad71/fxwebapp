import * as React from "react";
import styles from "./input.module.css";
import { cn } from "./cn";

export interface FieldProps {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Field: React.FC<React.PropsWithChildren<FieldProps>> = ({
  label,
  helperText,
  error,
  children,
}) => {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      {children}
      {error ? <div className={styles.error}>{error}</div> : null}
      {!error && helperText ? <div className={styles.helper}>{helperText}</div> : null}
    </div>
  );
};

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(styles.input, className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(styles.textarea, className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn(styles.select, className)} {...props} />
  )
);
Select.displayName = "Select";

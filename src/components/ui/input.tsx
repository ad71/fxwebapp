/**
 * Form inputs — Field wrapper with Input, Textarea, and Select primitives.
 *
 * @usage Always wrap inputs in `<Field>` for automatic label linking,
 *   error display, and helper text. Pass `error` prop to show validation state.
 * @a11y Field generates unique IDs, links `<label htmlFor>`, sets `aria-invalid`
 *   and `aria-describedby`, and renders errors with `role="alert"`.
 */
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
  const id = React.useId();
  const inputId = `field-${id}`;
  const errorId = error ? `field-err-${id}` : undefined;
  const helperId = !error && helperText ? `field-help-${id}` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      {label && <label className={styles.label} htmlFor={inputId}>{label}</label>}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
            id: inputId,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
          })
        : children}
      {error ? <div id={errorId} className={styles.error} role="alert">{error}</div> : null}
      {!error && helperText ? <div id={helperId} className={styles.helper}>{helperText}</div> : null}
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

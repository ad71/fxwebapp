/**
 * Modal — Centered dialog overlay for focused user decisions.
 *
 * @usage Use for confirmations, forms, and actions requiring attention.
 *   Compose body/footer with ModalBody and ModalFooter.
 *   Prefer Drawer for non-blocking detail views.
 * @a11y Focus trapped inside dialog; Escape closes; focus restored on unmount.
 *   Uses `role="dialog"` and `aria-modal="true"`.
 */
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import styles from "./overlay.module.css";
import { cn } from "./cn";
import { useLockBodyScroll } from "./use-lock-body-scroll";
import { useFocusTrap } from "./use-focus-trap";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onOpenChange, title, children }) => {
  const [visible, setVisible] = React.useState(false);
  const [stage, setStage] = React.useState<"enter" | "exit" | null>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  useLockBodyScroll(visible);
  useFocusTrap(dialogRef, open);

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      // Allow one frame for the DOM to mount with initial styles before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStage("enter"));
      });
    } else if (visible) {
      setStage("exit");
      const timer = setTimeout(() => {
        setVisible(false);
        setStage(null);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [open, visible]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!visible) return null;

  const overlayClass = cn(
    styles.overlay,
    stage === "enter" && styles.overlayEnter,
    stage === "exit" && styles.overlayExit,
  );

  const dialogClass = cn(
    styles.dialog,
    stage === "enter" && styles.dialogEnter,
    stage === "exit" && styles.dialogExit,
  );

  return createPortal(
    <div className={overlayClass} onClick={() => onOpenChange(false)}>
      <div
        ref={dialogRef}
        className={dialogClass}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    document.body
  );
};

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(styles.body, className)} {...props} />;

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(styles.footer, className)} {...props} />;

/**
 * Drawer — Right-aligned side sheet for detail views and secondary content.
 *
 * @usage Use for inspecting records, editing settings, or showing supplementary
 *   info without leaving the current page. Compose with DrawerBody/DrawerFooter.
 *   Prefer Modal for decisions requiring focused attention.
 * @a11y Focus trapped inside; Escape closes; focus restored on unmount.
 *   Uses `role="dialog"` and `aria-modal="true"` on `<aside>`.
 */
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import styles from "./overlay.module.css";
import { cn } from "./cn";
import { useLockBodyScroll } from "./use-lock-body-scroll";
import { useFocusTrap } from "./use-focus-trap";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open, onOpenChange, title, children }) => {
  const [visible, setVisible] = React.useState(false);
  const [stage, setStage] = React.useState<"enter" | "exit" | null>(null);
  const drawerRef = React.useRef<HTMLElement>(null);

  useLockBodyScroll(visible);
  useFocusTrap(drawerRef, open);

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStage("enter"));
      });
    } else if (visible) {
      setStage("exit");
      const timer = setTimeout(() => {
        setVisible(false);
        setStage(null);
      }, 320);
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

  const drawerClass = cn(
    styles.drawer,
    stage === "enter" && styles.drawerEnter,
    stage === "exit" && styles.drawerExit,
  );

  return createPortal(
    <div className={overlayClass} onClick={() => onOpenChange(false)}>
      <aside
        ref={drawerRef}
        className={drawerClass}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className={styles.drawerHeader}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        ) : null}
        {children}
      </aside>
    </div>,
    document.body
  );
};

export const DrawerBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(styles.drawerBody, className)} {...props} />;

export const DrawerFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(styles.drawerFooter, className)} {...props} />;

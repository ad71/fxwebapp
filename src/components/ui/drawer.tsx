"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import styles from "./overlay.module.css";
import { cn } from "./cn";
import { useLockBodyScroll } from "./use-lock-body-scroll";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open, onOpenChange, title, children }) => {
  useLockBodyScroll(open);

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

  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={() => onOpenChange(false)}>
      <aside
        className={styles.drawer}
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

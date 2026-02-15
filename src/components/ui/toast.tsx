/**
 * Toast — Global notification system with auto-dismiss and stacked display.
 *
 * @usage Wrap app in `<ToastProvider>`. Fire toasts via `useToast().addToast()`.
 *   Supports success/warning/danger/info variants with configurable duration.
 * @a11y `aria-live="polite"` on container; close button has `aria-label="Dismiss"`.
 */
"use client";

import * as React from "react";
import { X } from "lucide-react";
import styles from "./toast.module.css";
import { cn } from "./cn";

export type ToastVariant = "success" | "warning" | "danger" | "info";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface InternalToast extends ToastItem {
  exiting?: boolean;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};

const EXIT_MS = 200;

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = React.useState<InternalToast[]>([]);
  const timersRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = React.useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    timersRef.current.delete(id);
  }, []);

  const startExit = React.useCallback(
    (id: string) => {
      // Clear any pending auto-dismiss timer
      const existing = timersRef.current.get(id);
      if (existing) clearTimeout(existing);
      timersRef.current.delete(id);

      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, exiting: true } : item)),
      );
      const timer = setTimeout(() => removeToast(id), EXIT_MS);
      timersRef.current.set(`${id}-exit`, timer);
    },
    [removeToast],
  );

  const addToast = React.useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const duration = toast.duration ?? 4000;
      const next: InternalToast = { id, variant: "info", duration, ...toast };
      setItems((current) => [...current, next]);

      const timer = setTimeout(() => startExit(id), duration);
      timersRef.current.set(id, timer);
    },
    [startExit],
  );

  // Cleanup on unmount
  React.useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={styles.container} role="region" aria-live="polite" aria-label="Notifications">
        {items.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              styles.toast,
              styles[toast.variant || "info"],
              toast.exiting && styles.exiting,
            )}
            style={{ "--toast-duration": `${toast.duration ?? 4000}ms` } as React.CSSProperties}
          >
            <div className={styles.textGroup}>
              <div className={styles.title}>{toast.title}</div>
              {toast.message ? <div className={styles.message}>{toast.message}</div> : null}
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => startExit(toast.id)}
              aria-label="Dismiss"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
            {!toast.exiting && (
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} />
              </div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

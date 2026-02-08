"use client";

import * as React from "react";
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

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const next: ToastItem = { id, variant: "info", duration: 4000, ...toast };
    setItems((current) => [...current, next]);

    window.setTimeout(() => {
      setItems((current) => current.filter((item) => item.id !== id));
    }, next.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={styles.container}>
        {items.map((toast) => (
          <div key={toast.id} className={cn(styles.toast, styles[toast.variant || "info"])}>
            <div className={styles.title}>{toast.title}</div>
            {toast.message ? <div className={styles.message}>{toast.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

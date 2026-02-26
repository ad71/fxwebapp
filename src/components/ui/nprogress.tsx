"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import styles from "./nprogress.module.css";

export function NProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Route changed — complete
      setProgress(100);
      const t = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
      prevPathname.current = pathname;
      if (timerRef.current) clearInterval(timerRef.current);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  // Start progress on click of internal links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("http") || href.startsWith("#")) return;
      if (href === pathname) return;

      setProgress(15);
      setVisible(true);

      // Trickle
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) return p;
          return p + Math.random() * 10;
        });
      }, 300);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className={styles.bar}
      style={{ width: `${progress}%`, opacity: visible || progress > 0 ? 1 : 0 }}
    />
  );
}

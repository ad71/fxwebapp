"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./app-shell.module.css";

const NAV_ITEMS = [
  { label: "DASH", href: "/", icon: "⌂" },
  { label: "TRADE", href: "/trade", icon: "⇄" },
  { label: "DISCOVER", href: "/discover", icon: "✦" },
  { label: "WALLET", href: "/wallet", icon: "▤" },
  { label: "REPORT", href: "/report", icon: "▦" },
];

export const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.topbarLeft}>
            <Link href="/" className={styles.brand}>
              <div className={styles.brandMark}>
                <span className={styles.brandLetter}>F</span>
              </div>
              <span className={styles.brandName}>FX Platform</span>
            </Link>

            <button
              className={styles.menuToggle}
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              type="button"
            >
              <span className={styles.menuIcon} />
            </button>

            <nav
              className={`${styles.nav} ${mobileNavOpen ? styles.navOpen : ""}`}
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.search}>
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className={styles.searchPlaceholder}>Search...</span>
              <kbd className={styles.searchKbd}>
                <span>⌘</span>K
              </kbd>
            </div>

            <button className={styles.iconButton} aria-label="Notifications">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Marcus Corp</span>
                <span className={styles.userEmail}>marcus@corp.io</span>
              </div>
              <div className={styles.userAvatar}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
};

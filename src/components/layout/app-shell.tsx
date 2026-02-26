/**
 * AppShell — Top-level layout wrapper with sticky horizontal navigation bar.
 *
 * @usage Wraps all pages. Provides brand header, nav links, search bar,
 *   notification button, and user profile section. Responsive: collapses
 *   to hamburger menu below 1024px.
 */
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  ArrowLeftRight,
  Compass,
  Wallet,
  BarChart3,
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "../theme/theme-provider";
import styles from "./app-shell.module.css";

const NAV_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "DASH", href: "/", icon: LayoutDashboard },
  { label: "RATES", href: "/rates", icon: TrendingUp },
  { label: "TRADE", href: "/trade", icon: ArrowLeftRight },
  { label: "DISCOVER", href: "/discover", icon: Compass },
  { label: "WALLET", href: "/wallet", icon: Wallet },
  { label: "REPORT", href: "/report", icon: BarChart3 },
];

const THEME_CYCLE = ["light", "dark", "system"] as const;
const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor } as const;

export const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(theme);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  const ThemeIcon = THEME_ICONS[theme];

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
                <span className={styles.brandLetter}>bfx</span>
              </div>
              <span className={styles.brandName}>Balli FX</span>
            </Link>

            <button
              className={styles.menuToggle}
              onClick={() => setMobileNavOpen((prev) => !prev)}
              aria-label="Toggle navigation"
              type="button"
            >
              <span className={styles.menuIcon} />
            </button>

            {/* Mobile backdrop */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              className={`${styles.navBackdrop} ${mobileNavOpen ? styles.navBackdropVisible : ""}`}
              onClick={() => setMobileNavOpen(false)}
            />

            <nav
              className={`${styles.nav} ${mobileNavOpen ? styles.navOpen : ""}`}
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Icon size={16} strokeWidth={1.75} className={styles.navIcon} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.topbarRight}>
            <div className={styles.search} tabIndex={0}>
              <Search size={16} strokeWidth={2} className={styles.searchIcon} />
              <span className={styles.searchPlaceholder}>Search...</span>
              <kbd className={styles.searchKbd}>
                <span>⌘</span>K
              </kbd>
            </div>

            <button className={styles.iconButton} aria-label="Notifications">
              <Bell size={18} strokeWidth={2} />
            </button>

            <button
              className={styles.iconButton}
              aria-label={`Theme: ${theme}`}
              onClick={cycleTheme}
              title={`Theme: ${theme}`}
            >
              <ThemeIcon size={18} strokeWidth={2} />
            </button>

            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Ritik Bali</span>
                <span className={styles.userEmail}>ritik@bali.com</span>
              </div>
              <span className={styles.avatarCircle}>RB</span>
              <ChevronDown size={16} strokeWidth={2} className={styles.userChevron} />
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

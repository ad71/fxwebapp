"use client";

import * as React from "react";
import styles from "./section-anchor-nav.module.css";
import { cn } from "./cn";

export interface AnchorSection {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
}

export interface SectionAnchorNavProps {
  sections: AnchorSection[];
  activeId: string;
  className?: string;
}

export const SectionAnchorNav: React.FC<SectionAnchorNavProps> = ({
  sections,
  activeId,
  className,
}) => {
  const handleClick = (id: string) => {
    const el = document.getElementById(`section-${id}`);
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    el.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav className={cn(styles.nav, className)} aria-label="Page sections">
      <div className={styles.track}>
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              className={cn(styles.pill, s.id === activeId && styles.active)}
              onClick={() => handleClick(s.id)}
              aria-current={s.id === activeId ? "true" : undefined}
            >
              {Icon && <Icon size={14} />}
              {s.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

/**
 * useFocusTrap — Constrains Tab navigation within a container element.
 *
 * Auto-focuses first focusable element on activation. Wraps Tab/Shift+Tab
 * between first and last focusable children. Restores focus to the previously
 * focused element on deactivation. Used by Modal and Drawer.
 */
"use client";

import * as React from "react";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  React.useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (focusable.length) focusable[0].focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const els = container.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [active, containerRef]);
}

/**
 * useLockBodyScroll — Prevents body scroll when overlays are open.
 *
 * Sets `document.body.style.overflow = "hidden"` while `locked` is true.
 * Restores original overflow on cleanup. Used by Modal and Drawer.
 */
"use client";

import * as React from "react";

export function useLockBodyScroll(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

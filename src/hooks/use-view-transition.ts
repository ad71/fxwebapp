"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Returns a `navigate` function that wraps `router.push` with
 * the View Transitions API when available (progressive enhancement).
 *
 * Falls back to regular `router.push` in unsupported browsers.
 */
export function useViewTransition() {
  const router = useRouter();

  const navigate = useCallback(
    (href: string) => {
      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document
      ) {
        (document as any).startViewTransition(() => {
          router.push(href);
        });
      } else {
        router.push(href);
      }
    },
    [router],
  );

  return { navigate };
}

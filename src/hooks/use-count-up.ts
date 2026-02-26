"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function useCountUp({
  end,
  duration = 800,
  decimals = 0,
  prefix = "",
  suffix = "",
}: UseCountUpOptions): string {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const prevEndRef = useRef(end);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setValue(end);
      return;
    }

    const startValue = prevEndRef.current === end ? 0 : prevEndRef.current;
    prevEndRef.current = end;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (end - startValue) * eased;

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, [end, duration]);

  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}

"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContext {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
}

const Ctx = React.createContext<ThemeContext>({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
});

export function useTheme() {
  return React.useContext(Ctx);
}

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", resolved);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolved, setResolved] = React.useState<"light" | "dark">("light");

  // On mount: read from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("fx-theme") as Theme | null;
    const initial = stored || "system";
    setThemeState(initial);

    const r = initial === "system" ? getSystemPreference() : initial;
    setResolved(r);
    applyTheme(r);
  }, []);

  // Listen for system preference changes
  React.useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const r = e.matches ? "dark" : "light";
      setResolved(r);
      applyTheme(r);
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("fx-theme", t);
    const r = t === "system" ? getSystemPreference() : t;
    setResolved(r);
    applyTheme(r);
  }, []);

  return <Ctx.Provider value={{ theme, resolved, setTheme }}>{children}</Ctx.Provider>;
}

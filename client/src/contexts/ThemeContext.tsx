import React, { createContext, useContext, useEffect, useState } from "react";
import {
  accentOf,
  composeThemeId,
  isDarkTheme,
  modeOf,
  normalizeThemeId,
  type ThemeAccent,
  type ThemeId,
  type ThemeMode,
} from "@/lib/themes";

interface ThemeContextType {
  themeId: ThemeId;
  accent: ThemeAccent;
  mode: ThemeMode;
  setTheme: (id: ThemeId) => void;
  setAccent: (accent: ThemeAccent) => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultThemeId?: ThemeId;
}

/** 상단 상태바 색까지 테마를 따라가게 한다 (폰에서 PWA로 열었을 때 티가 난다) */
function syncBrowserThemeColor() {
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();
  if (!bg) return;

  for (const meta of document.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"]'
  )) {
    meta.setAttribute("content", bg);
  }
}

export function ThemeProvider({
  children,
  defaultThemeId,
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(() =>
    normalizeThemeId(localStorage.getItem("theme-id") ?? defaultThemeId ?? null)
  );

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", themeId);
    root.classList.toggle("dark", isDarkTheme(themeId));
    localStorage.setItem("theme-id", themeId);
    syncBrowserThemeColor();
  }, [themeId]);

  const value: ThemeContextType = {
    themeId,
    accent: accentOf(themeId),
    mode: modeOf(themeId),
    setTheme: setThemeId,
    setAccent: accent =>
      setThemeId(current => composeThemeId(accent, modeOf(current))),
    setMode: mode =>
      setThemeId(current => composeThemeId(accentOf(current), mode)),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

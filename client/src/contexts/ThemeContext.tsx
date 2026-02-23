import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_THEME, THEMES, type ThemeId } from "@/lib/themes";

interface ThemeContextType {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultThemeId?: ThemeId;
}

export function ThemeProvider({
  children,
  defaultThemeId = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const stored = localStorage.getItem("theme-id");
    return (stored as ThemeId) || defaultThemeId;
  });

  useEffect(() => {
    const root = document.documentElement;
    const meta = THEMES.find(t => t.id === themeId);

    root.setAttribute("data-theme", themeId);

    if (meta?.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme-id", themeId);
  }, [themeId]);

  const setTheme = (id: ThemeId) => setThemeId(id);

  return (
    <ThemeContext.Provider value={{ themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

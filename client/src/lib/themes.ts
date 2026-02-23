export type ThemeId =
  | "pastel-green-light"
  | "pastel-green-dark"
  | "pastel-pink-light"
  | "pastel-pink-dark"
  | "cream-beige-light"
  | "cream-beige-dark"
  | "soft-blue-light"
  | "soft-blue-dark";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  isDark: boolean;
  previewColors: { bg: string; primary: string; accent: string };
}

export const THEMES: ThemeMeta[] = [
  {
    id: "pastel-green-light",
    label: "Pastel Green",
    isDark: false,
    previewColors: { bg: "#f0faf4", primary: "#5f9e7a", accent: "#d4edde" },
  },
  {
    id: "pastel-green-dark",
    label: "Forest Night",
    isDark: true,
    previewColors: { bg: "#1a2e25", primary: "#7ec8a0", accent: "#2a4a35" },
  },
  {
    id: "pastel-pink-light",
    label: "Pastel Pink",
    isDark: false,
    previewColors: { bg: "#fdf2f5", primary: "#c27a8a", accent: "#f5d5de" },
  },
  {
    id: "pastel-pink-dark",
    label: "Romantic Night",
    isDark: true,
    previewColors: { bg: "#2a1a20", primary: "#e8a0b0", accent: "#3d2430" },
  },
  {
    id: "cream-beige-light",
    label: "Cream Beige",
    isDark: false,
    previewColors: { bg: "#fdf8f0", primary: "#8b6f4a", accent: "#f0e6d3" },
  },
  {
    id: "cream-beige-dark",
    label: "Vintage Night",
    isDark: true,
    previewColors: { bg: "#1e1a16", primary: "#c4a87a", accent: "#2e2820" },
  },
  {
    id: "soft-blue-light",
    label: "Soft Blue",
    isDark: false,
    previewColors: { bg: "#f0f6ff", primary: "#6b8fd8", accent: "#d5e4ff" },
  },
  {
    id: "soft-blue-dark",
    label: "Night Sky",
    isDark: true,
    previewColors: { bg: "#1a1f2e", primary: "#89b0e8", accent: "#252d42" },
  },
];

export const DEFAULT_THEME: ThemeId = "pastel-green-light";

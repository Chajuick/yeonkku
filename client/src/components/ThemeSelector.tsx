import { useTheme } from "@/contexts/ThemeContext";
import { THEMES, type ThemeMeta } from "@/lib/themes";
import { Check } from "lucide-react";

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: ThemeMeta;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative rounded-xl p-3 border-2 transition-all text-left hover:scale-105 ${
        isSelected
          ? "border-primary shadow-md"
          : "border-border hover:border-primary/50"
      }`}
      style={{ backgroundColor: theme.previewColors.bg }}
    >
      {/* Color swatches */}
      <div className="flex gap-1 mb-2">
        <div
          className="w-5 h-5 rounded-full border border-black/10"
          style={{ backgroundColor: theme.previewColors.bg }}
        />
        <div
          className="w-5 h-5 rounded-full border border-black/10"
          style={{ backgroundColor: theme.previewColors.primary }}
        />
        <div
          className="w-5 h-5 rounded-full border border-black/10"
          style={{ backgroundColor: theme.previewColors.accent }}
        />
      </div>

      {/* Theme name */}
      <p
        className="text-xs font-medium leading-tight"
        style={{ color: theme.isDark ? "#e8e8e8" : "#333333" }}
      >
        {theme.label}
      </p>
      <p
        className="text-xs opacity-60 leading-tight"
        style={{ color: theme.isDark ? "#c0c0c0" : "#666666" }}
      >
        {theme.isDark ? "Dark" : "Light"}
      </p>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

export default function ThemeSelector() {
  const { themeId, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {THEMES.map(theme => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={themeId === theme.id}
          onSelect={() => setTheme(theme.id)}
        />
      ))}
    </div>
  );
}

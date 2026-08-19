import { useTheme } from "@/contexts/ThemeContext";
import { ACCENTS, MODES } from "@/lib/themes";
import { Check, Moon, Sun } from "lucide-react";

const MODE_ICON = { light: Sun, dark: Moon } as const;

/**
 * 테마 고르기.
 *
 * 예전에는 (색 × 밝기) 조합 8개를 카드로 늘어놓았는데, 같은 색의 라이트/다크가
 * 따로 놓여 있어 무엇을 고르는 중인지 알기 어려웠다. 지금은 "색"과 "밝기"를
 * 두 줄로 나눠서, 각각 한 번씩만 고르면 되게 했다.
 */
export default function ThemeSelector() {
  const { accent, mode, setAccent, setMode } = useTheme();

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-muted-foreground">포인트 색</p>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map(item => {
            const selected = accent === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAccent(item.id)}
                aria-pressed={selected}
                className={`press flex items-center gap-1.5 rounded-full border py-1.5 pl-1.5 pr-3 text-sm font-medium ${
                  selected
                    ? "border-transparent bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-6.5 sm:w-6.5"
                  style={{ backgroundColor: item.swatch }}
                >
                  {selected && (
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  )}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-medium text-muted-foreground">화면 밝기</p>
        <div className="inline-flex rounded-2xl bg-muted p-1">
          {MODES.map(item => {
            const Icon = MODE_ICON[item.id];
            const selected = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                aria-pressed={selected}
                className={`press flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold ${
                  selected
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

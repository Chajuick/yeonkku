/**
 * 테마.
 *
 * 회색 계열(배경·카드·글자)은 모든 테마가 똑같이 쓰고, 포인트 색 하나만
 * 바꾼다. 색을 여러 개 흩뿌리지 않는 편이 화면이 훨씬 정돈돼 보인다.
 * 실제 색값은 index.css의 `[data-theme^="..."]` 블록에 있다.
 *
 * ThemeId는 예전에 저장된 값을 그대로 쓰기 위해 이름을 유지한다
 * (localStorage에 "pastel-green-light" 같은 값이 남아 있을 수 있다).
 */

export type ThemeAccent =
  | "soft-blue"
  | "pastel-green"
  | "pastel-pink"
  | "cream-beige";

export type ThemeMode = "light" | "dark";

export type ThemeId = `${ThemeAccent}-${ThemeMode}`;

export interface AccentMeta {
  id: ThemeAccent;
  label: string;
  /** 선택 UI에 찍히는 동그라미 색 (라이트 기준 포인트 색) */
  swatch: string;
}

export const ACCENTS: AccentMeta[] = [
  { id: "soft-blue", label: "블루", swatch: "#2c74dc" },
  { id: "pastel-green", label: "그린", swatch: "#05885a" },
  { id: "pastel-pink", label: "핑크", swatch: "#ce4373" },
  { id: "cream-beige", label: "샌드", swatch: "#a86822" },
];

export const MODES: { id: ThemeMode; label: string }[] = [
  { id: "light", label: "라이트" },
  { id: "dark", label: "다크" },
];

export const DEFAULT_THEME: ThemeId = "soft-blue-light";

const ACCENT_IDS = ACCENTS.map(a => a.id);

/** 저장된 문자열을 신뢰하지 않고 항상 유효한 ThemeId로 되돌린다 */
export function normalizeThemeId(value: string | null): ThemeId {
  if (!value) return DEFAULT_THEME;

  const mode: ThemeMode = value.endsWith("-dark") ? "dark" : "light";
  const accent = ACCENT_IDS.find(id => value.startsWith(id));

  return accent ? `${accent}-${mode}` : DEFAULT_THEME;
}

export function accentOf(id: ThemeId): ThemeAccent {
  return normalizeThemeId(id).replace(/-(light|dark)$/, "") as ThemeAccent;
}

export function modeOf(id: ThemeId): ThemeMode {
  return id.endsWith("-dark") ? "dark" : "light";
}

export function composeThemeId(accent: ThemeAccent, mode: ThemeMode): ThemeId {
  return `${accent}-${mode}`;
}

export function isDarkTheme(id: ThemeId): boolean {
  return modeOf(id) === "dark";
}

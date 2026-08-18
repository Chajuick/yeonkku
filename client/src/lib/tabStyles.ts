/**
 * 탭 활성 상태 스타일.
 *
 * shadcn 기본값은 활성 탭 배경이 bg-background인데, 이 앱의 파스텔 테마에서는
 * 카드 배경과 거의 같은 색이라 어떤 탭이 켜져 있는지 구분되지 않는다.
 * primary 색을 채워 확실히 드러낸다.
 */
export const TAB_TRIGGER_CLASS =
  "group flex items-center gap-1.5 rounded-xl text-muted-foreground transition-colors " +
  "data-[state=active]:bg-primary data-[state=active]:font-semibold " +
  "data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm";

/** 탭 라벨 앞에 붙는 단계 번호 뱃지 (활성 시 대비 유지) */
export const TAB_STEP_CLASS =
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 " +
  "text-[11px] font-semibold text-primary transition-colors " +
  "group-data-[state=active]:bg-primary-foreground/25 " +
  "group-data-[state=active]:text-primary-foreground";

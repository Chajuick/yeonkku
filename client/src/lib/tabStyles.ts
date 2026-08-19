/**
 * 세그먼트 컨트롤(탭) 스타일.
 *
 * 연회색 트랙 위에서 고른 칸만 흰 알약으로 떠오르는 형태다. 예전에는 활성 탭을
 * primary 색으로 꽉 채웠는데, 화면에서 가장 진한 색이 "지금 보고 있는 위치"에
 * 쓰이면 정작 눌러야 할 버튼이 묻힌다. 색은 행동(버튼)에만 남겨 둔다.
 */

/** TabsList에 붙이는 트랙 */
export const TAB_LIST_CLASS =
  "h-auto w-full rounded-2xl bg-secondary p-1 text-muted-foreground";

/**
 * TabsTrigger.
 *
 * 좁은 화면에서는 글자와 여백을 한 단계 줄인다. 4칸을 390px에 나눠 담아야
 * 하는데, 여기서 줄이지 않으면 "내보내기"가 "내보..."로 잘린다.
 */
export const TAB_TRIGGER_CLASS =
  "press group flex min-w-0 items-center justify-center gap-1 rounded-xl " +
  "border-transparent px-1 py-2.5 text-[13px] font-medium text-muted-foreground " +
  "sm:gap-1.5 sm:px-2 sm:text-sm " +
  "data-[state=active]:bg-card data-[state=active]:font-semibold " +
  "data-[state=active]:text-foreground data-[state=active]:shadow-xs " +
  "disabled:opacity-40";

/** 탭 라벨 앞에 붙는 단계 번호 뱃지 */
export const TAB_STEP_CLASS =
  "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full " +
  "bg-card text-[10px] font-bold text-muted-foreground transition-colors " +
  "sm:h-5 sm:w-5 sm:text-[11px] " +
  "group-data-[state=active]:bg-primary " +
  "group-data-[state=active]:text-primary-foreground";

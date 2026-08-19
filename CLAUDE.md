# yeonkku - 개발 가이드

## 프로젝트 개요

vCard 연락처 관리 앱. VCF 파일 가져오기/편집/내보내기, 접두사/접미사 일괄 편집 기능 제공.

## 패키지 매니저

**항상 `pnpm` 사용**. npm이나 yarn 절대 사용 금지.

```bash
pnpm install       # 의존성 설치
pnpm add <pkg>     # 패키지 추가
pnpm remove <pkg>  # 패키지 제거
```

## 개발 순서

```bash
pnpm dev      # 개발 서버 시작 (포트 3000)
pnpm check    # 타입체크 (커밋 전 필수)
pnpm format   # Prettier 포맷
pnpm build    # 프로덕션 빌드 (dist/)
pnpm preview  # 빌드 결과물 로컬 확인 (PWA 동작 확인용)
```

**커밋 전 순서:**

1. `pnpm check` - 타입 오류 0개 확인
2. `pnpm format` - 전체 파일 자동 포맷
3. `pnpm build` - 빌드 성공 확인

## 프로젝트 구조

```
yeonggu/
├── client/src/
│   ├── components/
│   │   └── ui/          # shadcn/ui 컴포넌트 (직접 수정 금지)
│   ├── pages/           # 페이지 컴포넌트 (Home, NotFound)
│   ├── hooks/           # 커스텀 훅 (useIndexedDBState, useMobile 등)
│   ├── contexts/        # React 컨텍스트 (ThemeContext)
│   ├── lib/             # 유틸리티 (vcardParser, storage, i18n, utils)
│   ├── App.tsx          # 라우팅 포함 루트 컴포넌트
│   └── main.tsx         # 진입점
├── shared/
│   ├── types.ts         # 공유 타입 (Contact, AppState 등)
│   └── const.ts         # 공유 상수
├── client/public/fonts/ # Pretendard 서브셋 (직접 호스팅, PWA 런타임 캐시)
├── vite.config.ts       # Vite 설정, 경로 별칭, PWA(vite-plugin-pwa)
└── vercel.json          # Vercel 정적 배포 설정 (SPA 리라이트/캐시 헤더)
```

## 경로 별칭

```typescript
@/          → client/src/
@shared/    → shared/
@assets/    → attached_assets/
```

## 코딩 컨벤션

- **TypeScript strict 모드** - 암시적 any 금지
- **`interface` 우선** - 공개 타입은 interface 사용 (shared/types.ts 참고)
- **`type`** - 유니온 타입, 유틸리티 타입, 로컬 전용 타입에 사용
- **`enum` 금지** → 문자열 리터럴 유니온 사용
- **Zod** - 런타임 유효성 검사가 필요한 경우 사용
- **`console.log` 금지** - 프로덕션 코드에 남기지 말 것

## UI 컨벤션

- shadcn/ui 컴포넌트는 `@/components/ui/`에서 사용 (직접 수정 금지)
- 커스텀 컴포넌트는 `@/components/`에 추가 (ui/ 하위 아님)
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인 사용)
- 애니메이션: 복잡한 것은 `framer-motion`, 단순한 것은 `tailwindcss-animate`

### 디자인 톤 (토스 계열)

- **중립 회색 + 포인트 색 하나.** 회색(배경·카드·글자)은 테마가 바뀌어도
  그대로고, `--brand`만 갈아끼운다. 색은 "누를 것"에만 쓴다
- **면 구성:** 페이지는 연회색(`--background`), 콘텐츠는 흰 카드(`--card`)
- **모서리:** `--radius: 1rem` 하나가 전부를 굴린다
  (버튼 `rounded-md`=14px, 카드 `rounded-xl`=20px)
- **그림자:** 거의 안 쓴다. 값은 `--elevation-*`에 있고 다크에서 갈아끼운다
  (`@theme inline`이 값을 인라인하므로 `--shadow-*`를 직접 재정의하면 안 먹는다)
- **입력칸:** `h-12 rounded-xl border-transparent bg-muted px-4`
- **주요 버튼:** `h-13`~`h-14`, `rounded-2xl`, `font-bold`, `press`
- **`.press`** — 누를 때 살짝 줄어드는 반응. 누를 수 있는 것에 붙인다
- **안내 상자**는 `.callout` + `.callout-info|warning|success|muted`.
  `bg-blue-50` 같은 하드코딩 금지 (다크에서 깨진다)

### 글자 대비 (회귀 주의)

회색 글자는 **본문 4.5:1 이상**을 지킨다. `--muted-foreground`는 라이트에서
`#4e5968`(흰 카드 위 7.1:1)이다. 예전 값 `#8b95a1`은 3.0:1이라 안 읽혔다.

- 이미 색이 정해진 글자에 `opacity-*`를 덧씌우지 말 것. 대비가 다시 무너진다
- 흐리게 보여야 하는 건 입력칸 안내문뿐이고, 그건 `--placeholder`가 따로 맡는다
  (index.css 맨 아래 레이어 밖 `::placeholder` 규칙. 유일한 레이어 예외)
- 포인트 색은 흰 글씨가 올라가므로 4.5:1에 맞춰 명도를 낮춰 뒀다.
  토스 원본 `#3182F6`은 흰 글씨 3.7:1이라 그대로 쓰지 않는다

### 한글 줄바꿈

`body`에 `word-break: keep-all` + `overflow-wrap: break-word`가 걸려 있다.
브라우저 기본값은 CJK를 글자 단위로 끊어서 "반갑습 / 니다"처럼 어절이 갈라진다.
띄어쓰기 없는 긴 값(이메일·URL)이 표를 밀면 그 요소에만 `.break-anywhere`.

keep-all은 어절 사이는 그대로 끊으므로 "한 / 번에"처럼 의존명사만 넘어가는 건
막지 못한다. 그런 쌍은 **줄바꿈 없는 공백(U+00A0)** 으로 묶어 뒀다
(할 수·볼 때·한 번·두 배·이 브라우저 …). 새 문구를 쓸 때도 같은 규칙을 따른다.
단, 긴 덩어리를 묶으면 좁은 화면에서 통째로 넘쳐 음절 중간이 깨지므로
**9자 이내**만 묶는다.

### 테마

- `ThemeId = "{accent}-{light|dark}"`, accent 4종 × 밝기 2종 = 8개
- 색값은 `client/src/index.css`의 `[data-theme^="..."]` 블록에만 있다
- 기본값 `soft-blue-light` (`client/src/lib/themes.ts`).
  `client/index.html`의 인라인 스크립트에 같은 기본값이 하드코딩돼 있으니
  바꿀 때 둘 다 고칠 것 (첫 페인트 깜빡임 방지용)

### 서체

Pretendard Variable을 `client/public/fonts/`에 직접 넣어 쓴다.
유니코드 구간별 서브셋 92개라서 PWA 프리캐시에서 빼고(`globIgnores`)
런타임 CacheFirst로 받는다. 서브셋 91·90번이 라틴 + 상용 한글이라 preload 대상.

## 상태 관리

- 주요 상태: `useIndexedDBState` 훅 (IndexedDB 영속 저장)
- 전역 상태 라이브러리 없음 - 크로스 컴포넌트 상태는 React 컨텍스트 사용
- `ThemeContext`로 테마 전환

## 라우팅

- `wouter`로 클라이언트 사이드 라우팅
- `App.tsx`에서 라우트 정의
- `vercel.json`의 rewrite가 모든 경로를 `index.html`로 넘김 (SPA)

## 배포 / PWA

- **백엔드 없음.** Vercel 정적 호스팅. 빌드 산출물은 `dist/`
- `vite-plugin-pwa`로 서비스워커·매니페스트 생성 (`registerType: "prompt"`)
  - 새 버전은 자동 새로고침하지 않고 토스트로 물어본다 (편집 중 데이터 보호)
  - 등록 코드: `client/src/pwa.ts`, 아이콘: `client/public/icon-*.png`
- Manus 스캐폴딩 플러그인(jsxLoc, manus-runtime, debug-collector)은 **dev 전용**.
  프로덕션 빌드에 넣으면 index.html에 수백 KB 인라인 스크립트가 박힌다
- `navigator.storage.persist()`를 첫 저장 시 호출 (IndexedDB 자동 삭제 방지)

## 주요 파일

- `shared/types.ts` - 핵심 데이터 타입 (Contact, PrefixSuffixItem, AppSettings, AppState)
- `client/src/lib/vcardParser.ts` - vCard 파싱 로직
- `client/src/lib/storage.ts` - IndexedDB 저장소 추상화
- `client/src/hooks/useIndexedDBState.ts` - 메인 상태 훅
- `client/src/index.css` - 디자인 토큰 전부 (테마 8종, 한글 줄바꿈, `.callout`/`.press`)
- `client/src/lib/tabStyles.ts` - 세그먼트 컨트롤(탭) 공용 클래스
- `client/src/lib/themes.ts` - 테마 ID 조합/해석

## 금지 사항

- ❌ `client/src/components/ui/` 직접 수정 (shadcn CLI 사용)
- ❌ 커밋 전 `console.log` 미제거
- ❌ `any` 타입 (사유 주석 없이 사용 금지)
- ❌ `npm` 또는 `yarn` 사용 (pnpm만 사용)
- ❌ `enum` 사용 (문자열 리터럴 유니온으로 대체)

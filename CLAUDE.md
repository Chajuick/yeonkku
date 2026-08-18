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
- 테마: 기본 라이트, `next-themes`로 다크 모드 지원
- 애니메이션: 복잡한 것은 `framer-motion`, 단순한 것은 `tailwindcss-animate`

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

## 금지 사항

- ❌ `client/src/components/ui/` 직접 수정 (shadcn CLI 사용)
- ❌ 커밋 전 `console.log` 미제거
- ❌ `any` 타입 (사유 주석 없이 사용 금지)
- ❌ `npm` 또는 `yarn` 사용 (pnpm만 사용)
- ❌ `enum` 사용 (문자열 리터럴 유니온으로 대체)

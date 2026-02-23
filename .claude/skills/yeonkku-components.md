---
name: yeonkku-components
description: yeonkku UI 컴포넌트 작업 시 적용. Use when creating, modifying, or reviewing React components, shadcn/ui usage, or Tailwind CSS styling.
---

# yeonkku 컴포넌트

## 컴포넌트 구조

```
client/src/components/
├── ui/                    # shadcn/ui 기반 (직접 수정 금지)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── table.tsx
│   └── ... (50+ 컴포넌트)
├── ContactsTable.tsx      # 연락처 목록 테이블
├── BatchActionsBar.tsx    # 일괄 작업 액션 바
├── ConfirmModal.tsx       # 확인 모달
├── ExportButton.tsx       # VCF 내보내기 버튼
├── ManusDialog.tsx        # Manus 다이얼로그
├── Map.tsx                # 지도 컴포넌트
├── PrefixSuffixManager.tsx # 접두사/접미사 관리
├── VcfImporter.tsx        # VCF 파일 임포터
└── ErrorBoundary.tsx      # 에러 바운더리
```

## shadcn/ui 사용 규칙

- `@/components/ui/`의 파일은 **직접 수정 금지**
- 새 shadcn 컴포넌트 추가: `pnpm dlx shadcn@latest add <component>`
- 커스텀 변형이 필요하면 ui/ 밖에 래퍼 컴포넌트 작성

```typescript
// 올바른 방법: 래퍼 컴포넌트 작성
// client/src/components/DangerButton.tsx
import { Button } from "@/components/ui/button";

export function DangerButton({ children, ...props }) {
  return <Button variant="destructive" {...props}>{children}</Button>;
}
```

## Tailwind CSS v4 주의사항

- `@tailwindcss/vite` 플러그인 사용 (PostCSS 불필요)
- 설정 파일: `tailwind.config.ts` 또는 CSS 변수 방식
- `tw-animate-css` 패키지로 추가 애니메이션 지원
- `tailwind-merge` + `clsx` → `cn()` 유틸 함수 사용

```typescript
// @/lib/utils.ts의 cn() 함수 항상 사용
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```

## 테마 시스템

- `ThemeProvider` (`contexts/ThemeContext.tsx`) 로 감싸져 있음
- `next-themes` 사용, 기본값 `"light"`
- 다크 모드 활성화 시: `<ThemeProvider switchable>` 로 변경

## 컴포넌트 작성 패턴

```typescript
// 권장 패턴
interface ContactsTableProps {
  contacts: Contact[];
  onSelect: (id: string) => void;
}

export function ContactsTable({ contacts, onSelect }: ContactsTableProps) {
  // ...
}
```

## 주요 UI 패키지

| 패키지 | 용도 |
|--------|------|
| `framer-motion` | 복잡한 애니메이션 |
| `lucide-react` | 아이콘 |
| `sonner` | 토스트 알림 |
| `recharts` | 차트 (필요 시) |
| `react-resizable-panels` | 패널 레이아웃 |
| `embla-carousel-react` | 캐러셀 |

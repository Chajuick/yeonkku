---
name: yeonkku-architecture
description: yeonkku 프로젝트 전체 구조와 관련된 작업 시 적용. Use when working with project structure, dependencies, or cross-cutting concerns.
---

# yeonkku 아키텍처

## 프로젝트 개요

vCard 연락처 관리 앱. 모든 데이터는 클라이언트(IndexedDB)에 저장되며, 서버는 정적 파일 서빙만 담당합니다.

## 전체 구조

```
client/src/       → React SPA (Vite 번들)
server/           → Express (정적 파일 서버, API 없음)
shared/           → 공유 타입 및 상수
```

## 의존성 방향

```
client/src/pages
    ↓
client/src/components
    ↓
client/src/hooks / client/src/lib
    ↓
shared/types (공유)
```

## 핵심 기술 스택

| 레이어 | 기술 |
|--------|------|
| 빌드 | Vite 7 + esbuild |
| 프레임워크 | React 19 |
| 언어 | TypeScript (strict) |
| UI | shadcn/ui + Radix UI + Tailwind CSS v4 |
| 라우팅 | wouter |
| 폼 | react-hook-form + zod |
| 상태 | IndexedDB (useIndexedDBState) |
| 서버 | Express (정적 파일 전용) |
| 테스트 | vitest |
| 포맷 | Prettier |

## 경로 별칭

```typescript
@/       → client/src/
@shared/ → shared/
@assets/ → attached_assets/
```

## 빌드 파이프라인

```
pnpm build
  ├── vite build → dist/public/ (프론트엔드)
  └── esbuild server/index.ts → dist/index.js (백엔드)
```

## 데이터 흐름

```
VCF 파일 → vcardParser.ts → Contact[] → useIndexedDBState → UI
                                         ↕
                                    IndexedDB (영속 저장)
```

## 주의사항

- 서버에 API 엔드포인트 없음 (순수 정적 파일 서버)
- 모든 비즈니스 로직은 클라이언트 사이드
- 데이터 영속성은 브라우저 IndexedDB에 의존

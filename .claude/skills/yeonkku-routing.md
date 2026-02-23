---
name: yeonkku-routing
description: yeonkku 라우팅 및 페이지 작업 시 적용. Use when adding routes, creating pages, or modifying navigation in the app.
---

# yeonkku 라우팅

## 라우터 설정

`wouter` 라이브러리 사용. `client/src/App.tsx`에서 라우트 정의.

```typescript
// App.tsx 현재 라우트 구성
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />  {/* 최종 폴백 */}
    </Switch>
  );
}
```

## 페이지 구조

```
client/src/pages/
├── Home.tsx      # 메인 페이지 (연락처 관리 UI)
└── NotFound.tsx  # 404 페이지
```

## 새 페이지 추가 방법

1. `client/src/pages/NewPage.tsx` 파일 생성
2. `App.tsx`의 Router에 라우트 추가

```typescript
// 1. 페이지 컴포넌트 생성
// client/src/pages/Settings.tsx
export default function Settings() {
  return <div>설정 페이지</div>;
}

// 2. App.tsx에 라우트 추가
import Settings from "@/pages/Settings";

<Route path="/settings" component={Settings} />
```

## wouter 네비게이션

```typescript
import { useLocation, Link } from "wouter";

// 프로그래매틱 이동
const [, navigate] = useLocation();
navigate("/settings");

// 링크 컴포넌트
<Link href="/settings">설정</Link>

// 현재 경로 확인
const [location] = useLocation();
```

## SPA 서버 설정

Express 서버가 모든 경로를 `index.html`로 리다이렉트 (SPA 방식):

```typescript
// server/index.ts
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});
```

새 페이지 추가 시 서버 설정 변경 불필요.

## 앱 레이아웃 구조

```
App.tsx
└── ErrorBoundary
    └── ThemeProvider
        └── TooltipProvider
            ├── Toaster (toast 알림)
            └── Router
                └── Switch
                    ├── Route "/" → Home
                    ├── Route "/404" → NotFound
                    └── Route "*" → NotFound
```

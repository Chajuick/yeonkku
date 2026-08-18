# 전체 빌드

정적 프론트엔드를 빌드합니다 (백엔드 없음, Vercel 정적 배포):

1. `pnpm check` 실행 - 타입 오류 없는지 확인
2. `pnpm build` 실행
   - Vite로 프론트엔드 빌드 → `dist/`
   - vite-plugin-pwa가 `sw.js`, `manifest.webmanifest` 생성
3. 빌드 결과물 확인은 `pnpm preview` (PWA 동작까지 확인 가능)

빌드 결과물: `dist/` 폴더

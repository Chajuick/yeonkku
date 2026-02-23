# 전체 빌드

프론트엔드와 백엔드를 모두 빌드합니다:

1. `pnpm check` 실행 - 타입 오류 없는지 확인
2. `pnpm build` 실행
   - Vite로 프론트엔드 빌드 → `dist/public/`
   - esbuild로 `server/index.ts` 빌드 → `dist/index.js`
3. 빌드 성공 시 `pnpm start`로 프로덕션 서버 실행 가능

빌드 결과물: `dist/` 폴더

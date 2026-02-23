# 전체 타입체크

TypeScript 타입 오류를 전체 검사합니다:

1. `pnpm check` 실행 (`tsc --noEmit`)
2. 오류 목록 출력 및 파일/라인 위치 안내
3. 오류가 있으면 수정 방법 제안

검사 범위: `client/src/**/*`, `shared/**/*`, `server/**/*`

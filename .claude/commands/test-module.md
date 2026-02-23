# 테스트 실행

vitest로 테스트를 실행합니다:

사용법: `/test-module [파일 경로 또는 모듈명]`

예시:

- `/test-module` - 전체 테스트 실행
- `/test-module vcardParser` - vcardParser 관련 테스트만 실행
- `/test-module client/src/lib` - lib 폴더 테스트 실행

실행 명령어: `pnpm vitest run [패턴]`

테스트 파일 위치 규칙:

- `*.test.ts` 또는 `*.test.tsx` 파일
- `__tests__/` 폴더 내 파일

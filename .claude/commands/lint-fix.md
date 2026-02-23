# 포맷 자동 수정

Prettier로 전체 코드를 자동 포맷합니다:

1. `pnpm format` 실행 (`prettier --write .`)
2. 수정된 파일 목록 출력
3. 포맷 후 `pnpm check`로 타입 오류 없는지 확인

Prettier 설정 위치: `.prettierrc`
주요 설정: semi(세미콜론 사용), singleQuote(false), tabWidth(2), endOfLine(lf)

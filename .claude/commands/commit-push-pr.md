# 커밋 → 푸시 → PR 생성

전체 커밋 워크플로우를 실행합니다:

1. `pnpm check` 실행 - 타입스크립트 오류 확인
2. `pnpm format` 실행 - 전체 파일 포맷
3. 변경된 파일 `git add` 스테이징
4. 커밋 메시지 작성 (컨벤셔널 커밋 형식)
5. 현재 브랜치에 푸시
6. 피처 브랜치인 경우 `gh pr create`로 PR 생성

커밋 메시지 형식: `타입(범위): 설명`
타입: feat, fix, refactor, chore, docs, style, test

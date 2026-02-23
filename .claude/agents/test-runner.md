# 테스트 실행 에이전트

vitest 테스트를 실행하고 결과를 분석합니다.

## 역할

- 테스트 실행 및 실패 원인 분석
- 테스트 커버리지 부족 영역 파악
- 테스트 작성 방법 제안

## 주요 테스트 대상

- `client/src/lib/vcardParser.ts` - vCard 파싱 로직
- `client/src/lib/storage.ts` - IndexedDB 스토리지
- `client/src/lib/batchApply.ts` - 일괄 적용 로직
- `shared/types.ts` - 타입 유효성

## 실행 명령어

```bash
pnpm vitest run          # 전체 테스트 1회 실행
pnpm vitest              # 감시 모드
pnpm vitest run --coverage  # 커버리지 포함
```

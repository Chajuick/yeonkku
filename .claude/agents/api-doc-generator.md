# API 문서 생성 에이전트

프로젝트의 주요 함수와 타입 문서를 자동 생성합니다.

## 역할

- `shared/types.ts` 타입 문서화
- `client/src/lib/` 유틸 함수 문서화
- `client/src/hooks/` 커스텀 훅 사용법 문서화
- vCard 파싱 관련 API 문서화

## 문서 생성 대상

| 파일                         | 문서화 내용                                   |
| ---------------------------- | --------------------------------------------- |
| `shared/types.ts`            | Contact, AppState, PrefixSuffixItem 타입 설명 |
| `lib/vcardParser.ts`         | 파싱 함수 입출력 명세                         |
| `lib/storage.ts`             | IndexedDB 저장소 API                          |
| `hooks/useIndexedDBState.ts` | 훅 사용법 및 반환값                           |

## 사용 시점

- 새 팀원 온보딩 시
- 라이브러리 함수 추가/변경 후
- 문서 업데이트가 필요할 때

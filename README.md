# 연꾸 (Yeonkku) - 연락처 꾸미기

React + TypeScript + Vite 기반의 **로컬 전용 vCard 편집 웹앱**입니다. 모든 데이터는 브라우저에서만 처리되며 외부 서버로 전송되지 않습니다.

## 주요 기능

### 📥 vCard 업로드

- **Drag & Drop** 또는 파일 선택으로 .vcf 파일 업로드
- vCard 2.1, 3.0, 4.0 형식 지원
- 한 파일에 여러 연락처 포함 가능
- 자동 파싱 및 내부 Contact 배열로 변환

### 📋 연락처 편집 (표 형식)

- **스프레드시트 스타일** 테이블 UI
- 체크박스로 다중 선택
- 필수 컬럼: ID, 표시이름(FN), 이름 구성요소(N), 전화, 이메일, 메모
- **인라인 편집**: 표 안에서 이름(FN) 즉시 수정 (Enter 저장, Esc 취소)
- **검색 필터**: 이름/전화/이메일로 빠르게 검색
- **정렬**: 각 컬럼 클릭으로 오름차순/내림차순 정렬
- 개별 연락처 삭제

### 🎨 Prefix/Suffix 관리

- **Prefix 목록**: 이름 앞에 붙일 텍스트/이모지 관리
- **Suffix 목록**: 이름 뒤에 붙일 텍스트/이모지 관리
- 각 항목별 활성화/비활성화 토글
- 항목 추가/수정/삭제
- **순서 변경**: 위/아래 이동 버튼으로 순서 조정
- **중복 방지**: 같은 텍스트가 이미 있으면 다시 붙이지 않음 (옵션)

### ⚡ 일괄 적용

- 선택된 연락처에 체크된 prefix/suffix 일괄 추가/제거
- **적용 방식**:
  - 기본: FN(표시이름)에만 적용
  - 옵션: N 필드(구조화된 이름)의 prefix/suffix 필드에도 반영
- **구분자 설정**: prefix 뒤/suffix 앞 공백 또는 커스텀 구분자 설정 가능
- 배치 작업 상태 표시 (선택 수, 활성화된 prefix/suffix 표시)

### 💾 상태 저장

- **IndexedDB 우선**: 브라우저의 IndexedDB에 자동 저장
- **localStorage 폴백**: IndexedDB 사용 불가 시 자동으로 localStorage 사용
- 새로고침해도 모든 데이터 유지
- 저장된 상태: contacts, prefixList, suffixList, UI 설정

### 📤 내보내기

- 현재 연락처를 .vcf 파일로 다운로드
- **vCard 3.0 형식**으로 직렬화
- 원본이 4.0/2.1이면 가능한 범위에서 호환성 유지
- **내보내기 미리보기**: 다운로드 전 내용 확인 가능
- 파일명: `yeonkku_export_YYYYMMDD.vcf`

### ⚙️ 설정

- **구분자 설정**: Prefix/Suffix 적용 시 사용할 구분자 커스터마이징
- **중복 방지 옵션**: 이미 있는 prefix/suffix 재적용 방지
- **N 필드 적용 옵션**: 구조화된 이름 필드에도 반영 여부 선택
- **초기화**: 모든 데이터 삭제 (확인 모달)

## 기술 스택

- **React 19** + **TypeScript** (strict mode)
- **Vite** (번들러)
- **Tailwind CSS 4** (스타일링)
- **shadcn/ui** (UI 컴포넌트)
- **IndexedDB** + **localStorage** (상태 저장)
- **Sonner** (토스트 알림)

## 프로젝트 구조

```
yeonkku/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VcfImporter.tsx         # vCard 파일 업로드
│   │   │   ├── ContactsTable.tsx       # 연락처 테이블 편집
│   │   │   ├── PrefixSuffixManager.tsx # Prefix/Suffix 관리
│   │   │   ├── BatchActionsBar.tsx     # 일괄 적용 액션 바
│   │   │   ├── ExportButton.tsx        # 내보내기 버튼 & 미리보기
│   │   │   ├── ConfirmModal.tsx        # 확인 모달
│   │   │   └── ui/                     # shadcn/ui 컴포넌트
│   │   ├── hooks/
│   │   │   └── useIndexedDBState.ts    # IndexedDB 상태 관리 훅
│   │   ├── lib/
│   │   │   ├── vcardParser.ts          # vCard 파싱/직렬화
│   │   │   ├── storage.ts              # IndexedDB/localStorage 유틸
│   │   │   └── batchApply.ts           # Prefix/Suffix 일괄 적용 로직
│   │   ├── pages/
│   │   │   └── Home.tsx                # 메인 페이지
│   │   ├── App.tsx                     # 라우터 & 테마 설정
│   │   ├── main.tsx                    # React 진입점
│   │   └── index.css                   # 전역 스타일
│   ├── index.html
│   └── public/                         # 정적 자산
├── shared/
│   └── types.ts                        # 공유 타입 정의
├── package.json
├── vite.config.ts
├── tsconfig.json
└── sample.vcf                          # 테스트용 샘플 파일
```

## 시작하기

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과물 미리보기
pnpm preview
```

### 타입 체크

```bash
# TypeScript 검사
pnpm check
```

## 사용 예시

### 1. 연락처 가져오기

1. "Contacts" 탭에서 .vcf 파일 드래그 앤 드롭 또는 "Select File" 클릭
2. 파일이 자동으로 파싱되고 테이블에 표시됨

### 2. Prefix/Suffix 설정

1. "Prefix/Suffix" 탭으로 이동
2. Prefix 입력 필드에 "Dr.", "Mr." 등 입력 후 "+" 버튼 클릭
3. Suffix 입력 필드에 "Jr.", "PhD" 등 입력
4. 필요시 순서 변경 (위/아래 버튼)

### 3. 연락처에 일괄 적용

1. "Contacts" 탭에서 연락처 선택 (체크박스)
2. 하단의 "Batch Actions Bar"에서 적용할 prefix/suffix 선택
3. "Apply to Selected" 클릭하여 일괄 적용
4. 또는 "Remove from Selected"로 제거

### 4. 설정 조정

1. "Settings" 탭에서 구분자 설정
2. 옵션 토글 (중복 방지, N 필드 적용)
3. "Save Separators" 클릭

### 5. 내보내기

1. "Export" 탭으로 이동
2. "Export as .vcf" 버튼 클릭
3. 미리보기 확인 후 "Download" 클릭
4. `yeonkku_export_YYYYMMDD.vcf` 파일 다운로드

## 핵심 구현 사항

### vCard 파싱

- **라인 폴딩 처리**: 줄바꿈 + 공백으로 이어진 라인 자동 병합
- **필드 추출**: FN, N, TEL, EMAIL, NOTE 등 주요 필드 파싱
- **버전 감지**: vCard 2.1, 3.0, 4.0 자동 인식

### Prefix/Suffix 적용

- **중복 방지**: 이미 포함된 텍스트는 재적용 안 함
- **구분자 처리**: prefix는 뒤에, suffix는 앞에 공백 추가
- **N 필드 지원**: 구조화된 이름의 prefix/suffix 필드에도 반영 가능

### 상태 관리

- **IndexedDB 우선**: 대용량 데이터 저장 가능
- **localStorage 폴백**: IndexedDB 미지원 환경 대응
- **자동 저장**: 500ms 디바운싱으로 성능 최적화

### 로컬 전용

- **네트워크 요청 금지**: 모든 처리가 브라우저에서만 발생
- **개인정보 보호**: 서버로 데이터 전송 없음
- **오프라인 작동**: 인터넷 연결 없이도 완전히 작동

## 제약 사항 및 주의사항

- 브라우저 저장소 용량 제한 (일반적으로 5-10MB)
- 매우 큰 vCard 파일(수천 개 연락처)은 성능 저하 가능
- 브라우저 데이터 삭제 시 모든 저장된 데이터 손실
- 다른 기기에서 동기화 불가 (로컬 전용)

## 라이선스

MIT

## 피드백 및 개선

이 앱은 개인정보 보호와 사용자 편의성을 최우선으로 설계되었습니다. 추가 기능이나 개선 사항이 있으면 언제든 피드백 주세요!

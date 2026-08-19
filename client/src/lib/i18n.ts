/**
 * Korean localization strings
 */

export const i18n = {
  // App title
  appTitle: "연꾸",
  appSubtitle: "제각각인 연락처 이름을 prefix·suffix로 한 번에 정리하는 도구",

  // 첫 방문 온보딩
  welcomeBadge: "처음 오셨나요?",
  welcomeTitle: "제각각인 연락처 이름, 한 번에 같은 형식으로",
  welcomeDescription:
    "[연꾸사] 김민수님, 연꾸사-김민수 처럼 저장할 때마다 형식이 달라진 연락처를, 앞뒤에 붙은 것을 떼고 통일된 형식으로 한 번에 다시 붙여 정리합니다. 파일은 이 브라우저 안에서만 처리되고 어디로도 전송되지 않아요.",
  welcomeBefore: "제각각으로 저장된 연락처",
  welcomeAfter: "한 번에 정리한 결과",
  welcomeBeforeSamples: ["[연꾸사] 김민수님", "연꾸사-이서연 님", "박준호"],
  welcomeAfterSamples: [
    "[연꾸사] 김민수 님",
    "[연꾸사] 이서연 님",
    "[연꾸사] 박준호 님",
  ],
  welcomeStep1Title: "가져오기",
  welcomeStep1Desc: "폰 연락처를 .vcf 파일로 내보내 여기에 올려요",
  welcomeStep2Title: "정리하기",
  welcomeStep2Desc:
    "붙어 있던 표기를 떼고, 통일할 형식(앞: [연꾸사] / 뒤: 님)을 골라 한 번에 적용해요",
  welcomeStep3Title: "내보내기",
  welcomeStep3Desc: "새 .vcf 파일을 내려받아 폰 연락처에 다시 넣으면 끝",
  welcomeTrySample: "샘플 연락처로 먼저 둘러보기",
  welcomeTrySampleHint:
    "형식이 뒤죽박죽인 샘플 5개로 정리 과정을 체험할 수 있어요",
  welcomeSampleLoaded: "샘플 연락처 5개를 불러왔어요",
  welcomeSampleLoadedDesc:
    "마음껏 눌러보세요. 설정 탭의 [모든 데이터 삭제]로 언제든 지울 수 있어요.",
  // .vcf 파일 꺼내는 법 (첫 사용자가 가장 많이 막히는 지점)
  vcfGuideTitle: "연락처 파일(.vcf)은 이렇게 꺼내요",
  vcfGuideDescription:
    "폰에 저장된 연락처를 파일 하나로 내보내는 과정이에요. 내 기기에 맞는 탭을 열어보세요.",
  vcfGuideNote:
    "기기와 OS 버전에 따라 메뉴 이름이 조금 다를 수 있어요. 비슷한 이름을 찾아보세요.",
  vcfGuidePlatforms: [
    {
      id: "iphone",
      label: "아이폰",
      steps: [
        "연락처 앱을 열어요",
        "연락처 하나를 길게 누른 뒤, 옮기고 싶은 연락처들을 이어서 탭해 여러 개 선택해요 (iOS 16 이상)",
        "공유 버튼 → [파일에 저장]을 눌러 저장하면 .vcf 파일이 만들어져요",
      ],
      tip: "연락처가 많으면 PC 브라우저에서 iCloud.com → 연락처 → 왼쪽 아래 톱니바퀴(또는 ··· 메뉴) → [vCard 내보내기]로 한 번에 받는 게 편해요.",
    },
    {
      id: "android",
      label: "안드로이드",
      steps: [
        "연락처 앱을 열고 왼쪽 위 메뉴(☰) 또는 [더보기]를 눌러요",
        "[연락처 관리] → [연락처 가져오기/내보내기]로 들어가요",
        "[내보내기]를 누르고 저장 위치를 고르면 .vcf 파일이 저장돼요 (보통 내부 저장공간이나 Download 폴더)",
      ],
      tip: "삼성 갤럭시는 [연락처 관리], LG·기타 기종은 [설정] 안에 같은 메뉴가 들어 있어요.",
    },
    {
      id: "google",
      label: "PC (구글 연락처)",
      steps: [
        "PC 브라우저에서 contacts.google.com에 접속해 폰과 같은 계정으로 로그인해요",
        "왼쪽 메뉴 아래쪽의 [내보내기]를 눌러요",
        "내보낼 대상을 고르고 형식은 [vCard]를 선택한 뒤 내보내면 .vcf 파일이 다운로드돼요",
      ],
      tip: "안드로이드 연락처는 대부분 구글 계정에 동기화돼 있어서, 폰을 만지지 않고 PC에서 바로 받는 게 가장 빨라요.",
    },
  ],
  vcfGuideMoveTitle: "폰에서 만든 파일을 PC로 옮기려면",
  vcfGuideMoveSteps: [
    "카카오톡 [나와의 채팅]에 파일을 보내고 PC 카카오톡에서 저장하기",
    "내 메일 주소로 파일을 첨부해 보내고 PC에서 내려받기",
  ],
  vcfGuideMobileHint:
    "폰에서 이 페이지를 열면 방금 저장한 파일을 바로 올릴 수 있어요.",
  // 그룹 관리
  groupTitle: "그룹 만들기",
  groupDescription:
    "연락처를 넣어둘 그룹을 미리 만들어 두세요. 연락처 탭에서 체크한 뒤 [그룹 지정]으로 한 번에 넣을 수 있어요.",
  groupPlaceholder: "예: 연꾸재단, 동호회, 거래처",
  groupAdd: "추가",
  groupEmpty: "아직 만든 그룹이 없습니다",
  groupCountUnit: "명",
  groupAdded: "그룹을 만들었습니다",
  groupDuplicate: "이미 있는 그룹입니다",
  groupRemove: "목록에서 빼기",
  groupRemoveHint:
    "목록에서 빼도 연락처에 지정된 그룹은 그대로 남습니다. 연락처의 그룹을 비우려면 [그룹 지정 → 그룹 비우기]를 쓰세요.",

  // 내보낸 파일을 폰에 되돌리는 안내
  applyGuideTitle: "내려받은 파일, 폰에 적용하기",
  applyGuideDescription:
    "내보낸 .vcf 파일을 폰으로 옮겨 연락처에 다시 넣는 과정이에요.",
  applyGuideMoveTitle: "먼저 파일을 폰으로 옮기세요",
  applyGuideMoveSteps: [
    "카카오톡 [나와의 채팅]에 파일을 보내고 폰에서 저장하기",
    "내 메일 주소로 첨부해 보내고 폰에서 내려받기",
  ],
  applyGuidePlatforms: [
    {
      id: "iphone",
      label: "아이폰",
      steps: [
        "폰으로 옮긴 .vcf 파일을 탭해서 엽니다",
        "연락처 미리보기가 뜨면 [모든 연락처 추가]를 누릅니다",
        "연락처 앱에서 반영된 이름을 확인합니다",
      ],
      tip: "PC에서 한 번에 넣으려면 iCloud.com → 연락처 → 톱니바퀴 → [vCard 가져오기]를 쓰세요.",
    },
    {
      id: "android",
      label: "안드로이드",
      steps: [
        "연락처 앱 → [연락처 관리] → [연락처 가져오기/내보내기]로 들어갑니다",
        "[가져오기]를 누르고 옮겨둔 .vcf 파일을 고릅니다",
        "저장할 계정(구글 계정 등)을 고르면 반영됩니다",
      ],
      tip: "파일 앱에서 .vcf를 바로 탭해도 연락처 앱이 열리면서 가져오기가 시작됩니다.",
    },
    {
      id: "google",
      label: "PC (구글 연락처)",
      steps: [
        "PC에서 contacts.google.com에 접속합니다",
        "왼쪽 메뉴의 [가져오기]에서 .vcf 파일을 올립니다",
        "폰이 같은 계정으로 동기화되면 자동으로 반영됩니다",
      ],
      tip: "구글 연락처에는 [중복 항목 찾기 및 병합] 기능이 있어, 아래 중복 문제를 정리하기 좋습니다.",
    },
  ],
  applyGuideWarningTitle: "덮어쓰기가 아니라 추가됩니다",
  applyGuideWarning:
    "대부분의 폰은 .vcf를 가져올 때 기존 연락처를 바꾸지 않고 새로 추가합니다. 그대로 넣으면 이름만 다른 사본이 생겨 연락처가 두 배가 됩니다.",
  applyGuideWarningSteps: [
    "넣기 전에 지금 폰 연락처를 .vcf로 한 번 내보내 백업해두세요",
    "기존 연락처를 지운 뒤 넣거나, 넣은 다음 중복 병합 기능으로 정리하세요",
  ],

  // 중복 의심 연락처
  dupTitle: "중복 의심 연락처",
  dupGroupCount: "개 그룹이 같은 사람일 수 있어요",
  dupExpand: "살펴보기",
  dupCollapse: "접기",
  dupIncludeSimilar: "이름이 비슷한 경우도 찾기",
  dupIncludeSimilarDesc:
    "이름이 두 글자 이상 겹치면 후보로 올립니다. 동명이인·같은 성씨까지 잡혀 목록이 늘어날 수 있어요.",
  dupReasonTel: "전화번호 같음",
  dupReasonEmail: "이메일 같음",
  dupReasonName: "이름 같음",
  dupReasonNameSimilar: "이름 비슷함",
  dupWeakHint: "근거가 약해요. 확인 후 처리하세요",
  dupPrimary: "남길 연락처",
  dupNoDetail: "추가 정보 없음",
  dupMerge: "하나로 합치기",
  dupIgnore: "중복 아님",
  dupEmpty: "중복 의심 연락처가 없습니다",
  dupMerged: "개를 하나로 합쳤습니다",
  dupIgnored: "중복 아님으로 표시했습니다",

  // 다음 단계 안내
  nextStepTitle: "이제 뭘 하면 되나요?",
  nextStepDesc:
    "정리할 연락처를 체크하면 아래에 적용·제거 버튼이 나타나요. 붙이거나 뗄 표기는 [2 정리하기] 탭에서 만들 수 있어요.",

  // Tabs
  tabContacts: "연락처",
  tabPrefixSuffix: "정리하기",
  tabSettings: "설정",
  tabLockedHint: "연락처를 먼저 가져오면 열려요",

  tabExport: "내보내기",

  // Import section
  importTitle: "연락처 가져오기",
  importDescription: ".vcf 파일을 업로드하세요",
  importDragDrop: ".vcf 파일을 올려주세요",
  importOrClick: "이 영역을 누르거나 파일을 끌어다 놓으세요",
  importSelectFile: "파일 선택",
  importSupportsVersions: "vCard 2.1, 3.0, 4.0 지원",
  importDataLocal: "데이터는 로컬에서만 처리되며 서버로 전송되지 않습니다.",
  importMore: "더 가져오기",

  // Contacts table
  contactsTitle: "연락처",
  contactsCount: "개",
  contactsSelected: "개 선택됨",
  contactsSearch: "이름·전화·이메일 검색",
  contactsTableName: "이름",
  contactsTableOrg: "그룹",
  contactsTablePhone: "전화",
  contactsTableEmail: "이메일",
  contactsTableNote: "메모",
  contactsTableAction: "작업",
  contactsEmpty: "연락처가 없습니다",
  contactsUpdated: "연락처가 업데이트되었습니다",
  contactsDeleted: "연락처가 삭제되었습니다",

  // Prefix/Suffix - 이름
  prefixTitle: "이름 앞에 붙일 표기",
  prefixDescription: "이름 앞에 붙일 글자나 이모지를 등록해요",
  prefixPlaceholder: "예: Mr., Dr., 🎓",
  suffixTitle: "이름 뒤에 붙일 표기",
  suffixDescription: "이름 뒤에 붙일 글자나 이모지를 등록해요",
  suffixPlaceholder: "예: Jr., PhD, ✨",
  prefixSuffixEmpty: "아직 없습니다",
  prefixSuffixAdded: "추가되었습니다",
  prefixSuffixDeleted: "삭제되었습니다",
  prefixSuffixDuplicate: "이미 존재합니다",
  prefixSuffixEmpty2: "입력해주세요",

  // Prefix/Suffix - 회사
  tabName: "이름",
  tabOrg: "그룹",
  orgPrefixTitle: "그룹명 앞에 붙일 표기",
  orgPrefixDescription: "그룹명 앞에 붙일 글자나 이모지를 등록해요",
  orgPrefixPlaceholder: "예: 🏢, (주), ★",
  orgSuffixTitle: "그룹명 뒤에 붙일 표기",
  orgSuffixDescription: "그룹명 뒤에 붙일 글자나 이모지를 등록해요",
  orgSuffixPlaceholder: "예: Corp., Inc., 팀",

  // Batch actions
  batchSelected: "개 선택됨",
  batchAttach: "붙이기",
  batchDetach: "떼어내기",
  batchAssignGroup: "그룹 지정",
  batchSectionNamePrefix: "이름 앞에",
  batchSectionNameSuffix: "이름 뒤에",
  batchSectionOrgPrefix: "그룹명 앞에",
  batchSectionOrgSuffix: "그룹명 뒤에",
  batchNoItems: "[2 정리하기] 탭에서 먼저 만들어주세요",
  batchAllDisabled: "모두 꺼져 있어요 (정리하기 탭에서 켜세요)",
  batchExistingGroups: "기존 그룹",
  batchNoGroups: "아직 그룹이 없습니다",
  batchNewGroup: "새 그룹에 넣기...",
  batchClearGroup: "그룹 비우기",
  batchNewGroupTitle: "새 그룹 이름",
  batchNewGroupPlaceholder: "예: 연꾸재단, 동호회, 거래처",
  batchNewGroupConfirm: "이 그룹에 넣기",
  batchGroupAssigned: "개를 그룹에 넣었습니다",
  batchGroupCleared: "개의 그룹을 비웠습니다",
  batchClearSelection: "선택 해제",
  batchDelete: "선택 삭제",
  confirmDeleteSelected: "선택한 연락처를 삭제할까요?",
  confirmDeleteSelectedDesc:
    "개 연락처를 목록에서 지웁니다. 폰에 저장된 실제 연락처는 그대로예요.",
  confirmDeleteButton: "삭제",
  toastDeletedSelected: "개 연락처를 삭제했습니다",

  // ContactsTable filter
  filterAllCompanies: "전체 그룹",

  // Settings
  settingsTitle: "설정",
  settingsSeparators: "구분자",
  settingsPrefixSeparator: "앞에 붙인 표기와 이름 사이",
  settingsSuffixSeparator: "이름과 뒤에 붙인 표기 사이",
  settingsSave: "구분자 저장",
  settingsOptions: "옵션",
  settingsPreventDuplicates: "중복 방지",
  settingsPreventDuplicatesDesc:
    "이름에 이미 들어 있는 표기는 다시 붙이지 않아요",
  settingsDangerZone: "위험 영역",
  settingsClearAll: "모든 데이터 삭제",
  settingsClearAllDesc:
    "모든 연락처와 설정을 삭제합니다. 이 작업은 되돌릴 수 없습니다.",
  settingsSaved: "설정이 저장되었습니다",

  // Export
  exportTitle: "연락처 내보내기",
  exportDescription: "연락처를 .vcf 파일로 다운로드하세요 (vCard 3.0 형식)",
  exportTotalContacts: "총 연락처",
  exportButton: "내보내기",
  exportAsVcf: ".vcf로 내보내기",
  exportModalTitle: "연락처 내보내기",
  exportModalDescription: "미리보기를 확인하고 다운로드하세요",
  exportExporting: "개 연락처를 내보내는 중",
  exportFormat: "파일 형식: vCard 3.0",
  exportPreview: "미리보기 (처음 500자):",
  exportCancel: "취소",
  exportDownload: "다운로드",
  exportSuccess: "개 연락처를 내보냈습니다",
  exportError: "내보내기 실패",
  exportNoContacts: "내보낼 연락처가 없습니다",

  // Batch preview modal
  previewTitle: "적용 전 확인",
  previewApply: "적용",
  previewCancel: "취소",
  previewAdd: "붙이기",
  previewAssignGroup: "그룹 지정",
  previewRemove: "떼어내기",
  previewNoChange: "변경 없음",

  // Confirm modal
  confirmClearAll: "모든 데이터를 삭제하시겠습니까?",
  confirmClearAllDesc:
    "모든 연락처, prefix/suffix, 설정이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",
  confirmClearAllButton: "모두 삭제",
  confirmCancel: "취소",

  // Toasts
  toastError: "오류",
  toastSuccess: "성공",
  toastInfo: "정보",
  toastLoading: "로딩 중...",
};

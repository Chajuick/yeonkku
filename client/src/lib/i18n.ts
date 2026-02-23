/**
 * Korean localization strings
 */

export const i18n = {
  // App title
  appTitle: "연꾸",
  appSubtitle: "연락처 꾸미기 - vCard 편집 및 관리",

  // Tabs
  tabContacts: "연락처",
  tabPrefixSuffix: "Prefix/Suffix",
  tabSettings: "설정",
  tabExport: "내보내기",

  // Import section
  importTitle: "연락처 가져오기",
  importDescription: ".vcf 파일을 업로드하세요",
  importDragDrop: ".vcf 파일을 여기로 드래그하세요",
  importOrClick: "또는 클릭하여 선택",
  importSelectFile: "파일 선택",
  importSupportsVersions: "vCard 2.1, 3.0, 4.0 지원",
  importDataLocal: "데이터는 로컬에서만 처리되며 서버로 전송되지 않습니다.",
  importMore: "더 가져오기",

  // Contacts table
  contactsTitle: "연락처",
  contactsCount: "개",
  contactsSelected: "선택됨",
  contactsSearch: "이름, 전화, 이메일로 검색...",
  contactsTableName: "이름 (FN)",
  contactsTableOrg: "회사",
  contactsTablePhone: "전화",
  contactsTableEmail: "이메일",
  contactsTableNote: "메모",
  contactsTableAction: "작업",
  contactsEmpty: "연락처가 없습니다",
  contactsUpdated: "연락처가 업데이트되었습니다",
  contactsDeleted: "연락처가 삭제되었습니다",

  // Prefix/Suffix - 이름
  prefixTitle: "Prefix",
  prefixDescription: "이름 앞에 붙을 텍스트/이모지를 추가하세요",
  prefixPlaceholder: "예: Mr., Dr., 🎓",
  suffixTitle: "Suffix",
  suffixDescription: "이름 뒤에 붙을 텍스트/이모지를 추가하세요",
  suffixPlaceholder: "예: Jr., PhD, ✨",
  prefixSuffixEmpty: "아직 없습니다",
  prefixSuffixAdded: "추가되었습니다",
  prefixSuffixDeleted: "삭제되었습니다",
  prefixSuffixDuplicate: "이미 존재합니다",
  prefixSuffixEmpty2: "입력해주세요",

  // Prefix/Suffix - 회사
  tabName: "이름",
  tabOrg: "회사",
  orgPrefixTitle: "Prefix",
  orgPrefixDescription: "회사명 앞에 붙을 텍스트/이모지를 추가하세요",
  orgPrefixPlaceholder: "예: 🏢, (주), ★",
  orgSuffixTitle: "Suffix",
  orgSuffixDescription: "회사명 뒤에 붙을 텍스트/이모지를 추가하세요",
  orgSuffixPlaceholder: "예: Corp., Inc., 팀",

  // Batch actions
  batchSelected: "개 연락처 선택됨",
  batchPrefixes: "이름 Prefix:",
  batchSuffixes: "이름 Suffix:",
  batchOrgPrefixes: "회사 Prefix:",
  batchOrgSuffixes: "회사 Suffix:",
  batchApply: "선택된 항목에 적용",
  batchRemove: "선택된 항목에서 제거",

  // ContactsTable filter
  filterAllCompanies: "전체 회사",

  // Settings
  settingsTitle: "설정",
  settingsSeparators: "구분자",
  settingsPrefixSeparator: "Prefix 구분자 (prefix 뒤)",
  settingsSuffixSeparator: "Suffix 구분자 (suffix 앞)",
  settingsSave: "구분자 저장",
  settingsOptions: "옵션",
  settingsPreventDuplicates: "중복 방지",
  settingsPreventDuplicatesDesc: "이름에 이미 있는 prefix/suffix는 다시 붙이지 않기",
  settingsApplyToNField: "N 필드에도 적용",
  settingsApplyToNFieldDesc: "구조화된 이름(N 필드)의 prefix/suffix 필드에도 반영",
  settingsDangerZone: "위험 영역",
  settingsClearAll: "모든 데이터 삭제",
  settingsClearAllDesc: "모든 연락처와 설정을 삭제합니다. 이 작업은 되돌릴 수 없습니다.",
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
  previewAdd: "추가",
  previewRemove: "제거",
  previewNoChange: "변경 없음",

  // Confirm modal
  confirmClearAll: "모든 데이터를 삭제하시겠습니까?",
  confirmClearAllDesc:
    "모든 연락처, prefix/suffix, 설정이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.",
  confirmClearAllButton: "모두 삭제",
  confirmCancel: "취소",

  // Toasts
  toastError: "오류",
  toastSuccess: "성공",
  toastInfo: "정보",
  toastLoading: "로딩 중...",
};

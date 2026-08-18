/**
 * Shared types for vCard contact management
 */

export interface Contact {
  id: string;
  fn: string; // Full Name (formatted name)
  n?: {
    family?: string;
    given?: string;
    additional?: string;
    prefix?: string;
    suffix?: string;
  };
  org?: string; // Organization (ORG field) - 이 앱에서는 "그룹"으로 쓴다
  /** ORG의 나머지 구성요소(부서/팀). 내보낼 때 되돌려 준다 */
  orgRest?: string[];
  tel?: string[]; // Telephone numbers
  email?: string[]; // Email addresses
  note?: string;
  vCardVersion?: string; // Original vCard version (2.1, 3.0, 4.0)
  rawVCard?: string; // Store original vCard for reference
}

export interface PrefixSuffixItem {
  id: string;
  text: string;
  enabled: boolean;
  type: "prefix" | "suffix";
}

export interface AppSettings {
  preventDuplicates: boolean;
  prefixSeparator: string; // Default: " " (space after prefix)
  suffixSeparator: string; // Default: " " (space before suffix)
}

export interface AppState {
  contacts: Contact[];
  prefixList: PrefixSuffixItem[];
  suffixList: PrefixSuffixItem[];
  orgPrefixList: PrefixSuffixItem[];
  orgSuffixList: PrefixSuffixItem[];
  /** 미리 만들어 둔 그룹 이름 목록 (연락처에 아직 안 쓰였어도 유지된다) */
  groupList?: string[];
  settings: AppSettings;
  /** 사용자가 "중복 아님"으로 넘긴 그룹 키 목록 */
  ignoredDuplicateKeys?: string[];
}

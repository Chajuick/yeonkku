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
  org?: string; // Organization (ORG field)
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
  applyToNField: boolean; // Apply to N field components
}

export interface AppState {
  contacts: Contact[];
  prefixList: PrefixSuffixItem[];
  suffixList: PrefixSuffixItem[];
  orgPrefixList: PrefixSuffixItem[];
  orgSuffixList: PrefixSuffixItem[];
  settings: AppSettings;
}

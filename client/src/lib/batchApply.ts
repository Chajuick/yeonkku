import { Contact, PrefixSuffixItem } from "@/../../shared/types";

/**
 * Apply prefixes and suffixes to contact names
 */

interface ApplyOptions {
  preventDuplicates: boolean;
  prefixSeparator: string;
  suffixSeparator: string;
  applyToNField: boolean;
}

/**
 * Check if a text already contains a prefix/suffix
 */
function alreadyContains(text: string, item: string): boolean {
  return text.includes(item);
}

/**
 * Apply selected prefixes to a contact
 */
export function applyPrefixesToContact(
  contact: Contact,
  prefixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledPrefixes = prefixes.filter((p) => p.enabled).map((p) => p.text);

  if (enabledPrefixes.length === 0) {
    return contact;
  }

  let newFn = contact.fn;

  // Apply prefixes to FN
  for (const prefix of enabledPrefixes) {
    if (options.preventDuplicates && alreadyContains(newFn, prefix)) {
      continue;
    }
    newFn = prefix + options.prefixSeparator + newFn;
  }

  // Apply to N field if enabled
  let newN = contact.n;
  if (options.applyToNField && contact.n) {
    let newPrefix = contact.n.prefix || "";
    for (const prefix of enabledPrefixes) {
      if (options.preventDuplicates && alreadyContains(newPrefix, prefix)) {
        continue;
      }
      newPrefix = prefix + options.prefixSeparator + newPrefix;
    }
    newN = { ...contact.n, prefix: newPrefix };
  }

  return {
    ...contact,
    fn: newFn,
    n: newN,
  };
}

/**
 * Apply selected suffixes to a contact
 */
export function applySuffixesToContact(
  contact: Contact,
  suffixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledSuffixes = suffixes.filter((s) => s.enabled).map((s) => s.text);

  if (enabledSuffixes.length === 0) {
    return contact;
  }

  let newFn = contact.fn;

  // Apply suffixes to FN
  for (const suffix of enabledSuffixes) {
    if (options.preventDuplicates && alreadyContains(newFn, suffix)) {
      continue;
    }
    newFn = newFn + options.suffixSeparator + suffix;
  }

  // Apply to N field if enabled
  let newN = contact.n;
  if (options.applyToNField && contact.n) {
    let newSuffix = contact.n.suffix || "";
    for (const suffix of enabledSuffixes) {
      if (options.preventDuplicates && alreadyContains(newSuffix, suffix)) {
        continue;
      }
      newSuffix = newSuffix + options.suffixSeparator + suffix;
    }
    newN = { ...contact.n, suffix: newSuffix };
  }

  return {
    ...contact,
    fn: newFn,
    n: newN,
  };
}

/**
 * Remove prefixes from a contact
 */
export function removePrefixesFromContact(
  contact: Contact,
  prefixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledPrefixes = prefixes.filter((p) => p.enabled).map((p) => p.text);

  if (enabledPrefixes.length === 0) {
    return contact;
  }

  let newFn = contact.fn;

  // Remove prefixes from FN
  for (const prefix of enabledPrefixes) {
    const pattern = new RegExp(`^${escapeRegex(prefix)}\\s*`);
    newFn = newFn.replace(pattern, "");
  }

  // Remove from N field if enabled
  let newN = contact.n;
  if (options.applyToNField && contact.n?.prefix) {
    let newPrefix = contact.n.prefix;
    for (const prefix of enabledPrefixes) {
      const pattern = new RegExp(`^${escapeRegex(prefix)}\\s*`);
      newPrefix = newPrefix.replace(pattern, "");
    }
    newN = { ...contact.n, prefix: newPrefix };
  }

  return {
    ...contact,
    fn: newFn,
    n: newN,
  };
}

/**
 * Remove suffixes from a contact
 */
export function removeSuffixesFromContact(
  contact: Contact,
  suffixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledSuffixes = suffixes.filter((s) => s.enabled).map((s) => s.text);

  if (enabledSuffixes.length === 0) {
    return contact;
  }

  let newFn = contact.fn;

  // Remove suffixes from FN
  for (const suffix of enabledSuffixes) {
    const pattern = new RegExp(`\\s*${escapeRegex(suffix)}$`);
    newFn = newFn.replace(pattern, "");
  }

  // Remove from N field if enabled
  let newN = contact.n;
  if (options.applyToNField && contact.n?.suffix) {
    let newSuffix = contact.n.suffix;
    for (const suffix of enabledSuffixes) {
      const pattern = new RegExp(`\\s*${escapeRegex(suffix)}$`);
      newSuffix = newSuffix.replace(pattern, "");
    }
    newN = { ...contact.n, suffix: newSuffix };
  }

  return {
    ...contact,
    fn: newFn,
    n: newN,
  };
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Apply prefixes and suffixes to multiple contacts
 */
export function batchApplyPrefixSuffix(
  contacts: Contact[],
  selectedIds: Set<string>,
  prefixes: PrefixSuffixItem[],
  suffixes: PrefixSuffixItem[],
  action: "add" | "remove",
  options: ApplyOptions
): Contact[] {
  return contacts.map((contact) => {
    if (!selectedIds.has(contact.id)) {
      return contact;
    }

    let updated = contact;

    if (action === "add") {
      updated = applyPrefixesToContact(updated, prefixes, options);
      updated = applySuffixesToContact(updated, suffixes, options);
    } else {
      updated = removePrefixesFromContact(updated, prefixes, options);
      updated = removeSuffixesFromContact(updated, suffixes, options);
    }

    return updated;
  });
}

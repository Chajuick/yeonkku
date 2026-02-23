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
  const enabledPrefixes = prefixes.filter(p => p.enabled).map(p => p.text);

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
  const enabledSuffixes = suffixes.filter(s => s.enabled).map(s => s.text);

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
  const enabledPrefixes = prefixes.filter(p => p.enabled).map(p => p.text);

  if (enabledPrefixes.length === 0) {
    return contact;
  }

  let newFn = contact.fn;

  // Remove prefixes from FN
  const prefixSep = escapeRegex(options.prefixSeparator);
  for (const prefix of enabledPrefixes) {
    const pattern = new RegExp(`^${escapeRegex(prefix)}(?:${prefixSep}|\\s*)`);
    newFn = newFn.replace(pattern, "");
  }

  // Remove from N field if enabled
  let newN = contact.n;
  if (options.applyToNField && contact.n?.prefix) {
    let newPrefix = contact.n.prefix;
    for (const prefix of enabledPrefixes) {
      const pattern = new RegExp(
        `^${escapeRegex(prefix)}(?:${prefixSep}|\\s*)`
      );
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
  const enabledSuffixes = suffixes.filter(s => s.enabled).map(s => s.text);

  if (enabledSuffixes.length === 0) {
    return contact;
  }

  let newFn = contact.fn;

  // Remove suffixes from FN
  const suffixSep = escapeRegex(options.suffixSeparator);
  for (const suffix of enabledSuffixes) {
    const pattern = new RegExp(`(?:${suffixSep}|\\s*)${escapeRegex(suffix)}$`);
    newFn = newFn.replace(pattern, "");
  }

  // Remove from N field if enabled
  let newN = contact.n;
  if (options.applyToNField && contact.n?.suffix) {
    let newSuffix = contact.n.suffix;
    for (const suffix of enabledSuffixes) {
      const pattern = new RegExp(
        `(?:${suffixSep}|\\s*)${escapeRegex(suffix)}$`
      );
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
 * Apply prefixes to contact's ORG field
 */
export function applyPrefixesToOrg(
  contact: Contact,
  prefixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledPrefixes = prefixes.filter(p => p.enabled).map(p => p.text);
  if (enabledPrefixes.length === 0 || !contact.org) return contact;

  let newOrg = contact.org;
  for (const prefix of enabledPrefixes) {
    if (options.preventDuplicates && alreadyContains(newOrg, prefix)) continue;
    newOrg = prefix + options.prefixSeparator + newOrg;
  }
  return { ...contact, org: newOrg };
}

/**
 * Apply suffixes to contact's ORG field
 */
export function applySuffixesToOrg(
  contact: Contact,
  suffixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledSuffixes = suffixes.filter(s => s.enabled).map(s => s.text);
  if (enabledSuffixes.length === 0 || !contact.org) return contact;

  let newOrg = contact.org;
  for (const suffix of enabledSuffixes) {
    if (options.preventDuplicates && alreadyContains(newOrg, suffix)) continue;
    newOrg = newOrg + options.suffixSeparator + suffix;
  }
  return { ...contact, org: newOrg };
}

/**
 * Remove prefixes from contact's ORG field
 */
export function removePrefixesFromOrg(
  contact: Contact,
  prefixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledPrefixes = prefixes.filter(p => p.enabled).map(p => p.text);
  if (enabledPrefixes.length === 0 || !contact.org) return contact;

  const sep = escapeRegex(options.prefixSeparator);
  let newOrg = contact.org;
  for (const prefix of enabledPrefixes) {
    const pattern = new RegExp(`^${escapeRegex(prefix)}(?:${sep}|\\s*)`);
    newOrg = newOrg.replace(pattern, "");
  }
  return { ...contact, org: newOrg };
}

/**
 * Remove suffixes from contact's ORG field
 */
export function removeSuffixesFromOrg(
  contact: Contact,
  suffixes: PrefixSuffixItem[],
  options: ApplyOptions
): Contact {
  const enabledSuffixes = suffixes.filter(s => s.enabled).map(s => s.text);
  if (enabledSuffixes.length === 0 || !contact.org) return contact;

  const sep = escapeRegex(options.suffixSeparator);
  let newOrg = contact.org;
  for (const suffix of enabledSuffixes) {
    const pattern = new RegExp(`(?:${sep}|\\s*)${escapeRegex(suffix)}$`);
    newOrg = newOrg.replace(pattern, "");
  }
  return { ...contact, org: newOrg };
}

/**
 * Apply prefixes and suffixes to multiple contacts (FN and ORG)
 */
export function batchApplyPrefixSuffix(
  contacts: Contact[],
  selectedIds: Set<string>,
  prefixes: PrefixSuffixItem[],
  suffixes: PrefixSuffixItem[],
  orgPrefixes: PrefixSuffixItem[],
  orgSuffixes: PrefixSuffixItem[],
  action: "add" | "remove",
  options: ApplyOptions
): Contact[] {
  return contacts.map(contact => {
    if (!selectedIds.has(contact.id)) return contact;

    let updated = contact;

    if (action === "add") {
      updated = applyPrefixesToContact(updated, prefixes, options);
      updated = applySuffixesToContact(updated, suffixes, options);
      updated = applyPrefixesToOrg(updated, orgPrefixes, options);
      updated = applySuffixesToOrg(updated, orgSuffixes, options);
    } else {
      updated = removePrefixesFromContact(updated, prefixes, options);
      updated = removeSuffixesFromContact(updated, suffixes, options);
      updated = removePrefixesFromOrg(updated, orgPrefixes, options);
      updated = removeSuffixesFromOrg(updated, orgSuffixes, options);
    }

    return updated;
  });
}

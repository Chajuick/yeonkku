import { Contact } from "@/../../shared/types";
import {
  decodeQuotedPrintable,
  isQuotedPrintable,
  extractCharset,
  extractEncoding,
} from "./quotedPrintable";

/**
 * vCard Parser - Parses vCard format (2.1, 3.0, 4.0) to Contact objects
 * Handles line folding, field parsing, Quoted-Printable decoding, and version detection
 */

interface FieldValue {
  value: string;
  params: Map<string, string>;
}

interface ParsedVCard {
  version: string;
  fields: Map<string, FieldValue[]>;
}

/**
 * Unfold vCard lines (handle line continuations)
 * Lines starting with space/tab are continuations of previous line
 */
function unfoldLines(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const unfolded: string[] = [];

  for (const line of lines) {
    if (line.match(/^[ \t]/) && unfolded.length > 0) {
      // Continuation line - append to previous
      unfolded[unfolded.length - 1] += line.substring(1);
    } else if (line.trim()) {
      unfolded.push(line);
    }
  }

  return unfolded;
}

/**
 * Parse a single vCard text block
 */
function parseVCardBlock(vcardText: string): ParsedVCard {
  const lines = unfoldLines(vcardText);
  const fields = new Map<string, FieldValue[]>();
  let version = "3.0"; // Default version

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and BEGIN/END markers
    if (!trimmed || trimmed.startsWith("BEGIN:") || trimmed.startsWith("END:")) {
      continue;
    }

    // Extract field name and value
    // Format: FIELD;PARAM1=VALUE1;PARAM2=VALUE2:actual_value
    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const fieldPart = trimmed.substring(0, colonIndex);
    let value = trimmed.substring(colonIndex + 1);

    // Parse field name and parameters
    const parts = fieldPart.split(";");
    const fieldName = parts[0].toUpperCase();
    const params = new Map<string, string>();

    for (let i = 1; i < parts.length; i++) {
      const param = parts[i];
      const eqIndex = param.indexOf("=");
      if (eqIndex > -1) {
        const key = param.substring(0, eqIndex).trim().toUpperCase();
        const val = param.substring(eqIndex + 1).trim();
        params.set(key, val);
      }
    }

    if (fieldName === "VERSION") {
      version = value;
    }

    // Decode Quoted-Printable if needed
    const encoding = params.get("ENCODING") || "";
    const charset = params.get("CHARSET") || "utf-8";

    if (encoding.toUpperCase() === "QUOTED-PRINTABLE" || isQuotedPrintable(value)) {
      try {
        value = decodeQuotedPrintable(value, charset);
      } catch (error) {
        console.warn(`Failed to decode Quoted-Printable for ${fieldName}:`, error);
      }
    }

    // Store all values for this field with params
    if (!fields.has(fieldName)) {
      fields.set(fieldName, []);
    }
    fields.get(fieldName)!.push({ value, params });
  }

  return { version, fields };
}

/**
 * Parse N field (structured name)
 * Format: Family;Given;Additional;Prefix;Suffix
 */
function parseNField(nValue: string) {
  const parts = nValue.split(";").map((p) => p.trim());
  return {
    family: parts[0] || undefined,
    given: parts[1] || undefined,
    additional: parts[2] || undefined,
    prefix: parts[3] || undefined,
    suffix: parts[4] || undefined,
  };
}

/**
 * Extract first value from field array
 */
function getFirstFieldValue(fieldArray: FieldValue[] | undefined): string | undefined {
  if (!fieldArray || fieldArray.length === 0) return undefined;
  return fieldArray[0].value;
}

/**
 * Parse multiple vCard blocks from text
 */
export function parseVCardText(text: string): Contact[] {
  const contacts: Contact[] = [];

  // Split by BEGIN:VCARD / END:VCARD
  const vCardRegex = /BEGIN:VCARD[\s\S]*?END:VCARD/gi;
  const matches = text.match(vCardRegex) || [];

  for (const vcardBlock of matches) {
    const parsed = parseVCardBlock(vcardBlock);
    const fields = parsed.fields;

    // Extract required fields
    const fnValue =
      getFirstFieldValue(fields.get("FN")) ||
      getFirstFieldValue(fields.get("N")) ||
      "Unnamed";
    const nFieldValue = getFirstFieldValue(fields.get("N"));

    // Extract tel and email arrays
    const telArray = fields.get("TEL") || [];
    const emailArray = fields.get("EMAIL") || [];
    const tel = telArray
      .map((t) => t.value || "")
      .filter((t) => t);
    const email = emailArray
      .map((e) => e.value || "")
      .filter((e) => e);

    const contact: Contact = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      fn: fnValue,
      n: nFieldValue ? parseNField(nFieldValue) : undefined,
      tel,
      email,
      note: getFirstFieldValue(fields.get("NOTE")),
      vCardVersion: parsed.version,
      rawVCard: vcardBlock,
    };

    contacts.push(contact);
  }

  return contacts;
}

/**
 * Fold vCard line to 75 characters (RFC 2425)
 * Continuation lines start with a space
 */
function foldLine(line: string, maxLength: number = 75): string[] {
  const lines: string[] = [];
  let currentLine = line;

  while (currentLine.length > maxLength) {
    lines.push(currentLine.substring(0, maxLength));
    currentLine = " " + currentLine.substring(maxLength);
  }

  lines.push(currentLine);
  return lines;
}

/**
 * Escape special characters in vCard values
 */
function escapeVCardValue(value: string): string {
  if (!value) return "";
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Serialize Contact to vCard 3.0 format with UTF-8 and line folding
 */
export function contactToVCard(contact: Contact): string {
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");
  lines.push("PRODID:-//Yeonkku//vCard Editor//EN");

  // FN (Formatted Name) - required
  const fnLine = `FN:${escapeVCardValue(contact.fn)}`;
  lines.push(...foldLine(fnLine));

  // N (Structured Name)
  if (contact.n) {
    const nParts = [
      contact.n.family || "",
      contact.n.given || "",
      contact.n.additional || "",
      contact.n.prefix || "",
      contact.n.suffix || "",
    ];
    const nLine = `N:${nParts.map(escapeVCardValue).join(";")}`;
    lines.push(...foldLine(nLine));
  } else {
    // Generate N from FN if not present
    const nLine = `N:${escapeVCardValue(contact.fn)};;;`;
    lines.push(...foldLine(nLine));
  }

  // TEL (Telephone)
  if (contact.tel && contact.tel.length > 0) {
    for (const tel of contact.tel) {
      if (tel.trim()) {
        const telLine = `TEL:${escapeVCardValue(tel)}`;
        lines.push(...foldLine(telLine));
      }
    }
  }

  // EMAIL
  if (contact.email && contact.email.length > 0) {
    for (const email of contact.email) {
      if (email.trim()) {
        const emailLine = `EMAIL:${escapeVCardValue(email)}`;
        lines.push(...foldLine(emailLine));
      }
    }
  }

  // NOTE
  if (contact.note) {
    const noteLine = `NOTE:${escapeVCardValue(contact.note)}`;
    lines.push(...foldLine(noteLine));
  }

  lines.push("END:VCARD");

  return lines.join("\r\n");
}

/**
 * Serialize multiple contacts to vCard file content with UTF-8 encoding
 */
export function contactsToVCardFile(contacts: Contact[]): string {
  return contacts.map(contactToVCard).join("\r\n");
}

/**
 * Generate filename for export
 */
export function generateExportFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `yeonkku_export_${year}${month}${day}.vcf`;
}

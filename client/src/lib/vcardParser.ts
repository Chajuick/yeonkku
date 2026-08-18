import { nanoid } from "nanoid";
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
 * vCard 논리 줄 복원.
 *
 * 두 가지 줄바꿈 규칙을 함께 처리한다.
 * 1. RFC 2425 folding: 다음 줄이 공백/탭으로 시작하면 앞 줄의 연속
 * 2. vCard 2.1 Quoted-Printable soft line break: 줄 끝 "="가 다음 줄로 이어짐
 *
 * 2번을 처리하지 않으면 한글 이름이 중간에서 잘리고 끝에 "="가 남는다.
 * (한국 휴대폰이 내보내는 vCard 2.1에서 가장 흔한 깨짐 원인)
 */
function unfoldLines(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const unfolded: string[] = [];
  let currentIsQuotedPrintable = false;

  for (const line of lines) {
    const lastIndex = unfolded.length - 1;

    if (line.match(/^[ \t]/) && unfolded.length > 0) {
      // Continuation line - append to previous
      unfolded[lastIndex] += line.substring(1);
      continue;
    }

    // QP 소프트 줄바꿈: 앞 줄 끝의 "="를 떼고 다음 줄을 그대로 이어 붙인다.
    // BASE64 사진 값도 "="로 끝날 수 있어 QP 필드일 때만 적용한다.
    if (
      currentIsQuotedPrintable &&
      unfolded.length > 0 &&
      unfolded[lastIndex].endsWith("=")
    ) {
      unfolded[lastIndex] = unfolded[lastIndex].slice(0, -1) + line;
      continue;
    }

    if (line.trim()) {
      unfolded.push(line);
      currentIsQuotedPrintable = /ENCODING=QUOTED-PRINTABLE/i.test(
        line.split(":")[0]
      );
    }
  }

  return unfolded;
}

/**
 * "item1.TEL" 처럼 앞에 붙은 그룹 접두사를 떼어낸다.
 * (아이폰이 라벨을 붙이려고 쓰는 표기)
 */
function stripGroupPrefix(fieldName: string): string {
  const dotIndex = fieldName.indexOf(".");
  return dotIndex > -1 ? fieldName.substring(dotIndex + 1) : fieldName;
}

/** vCard 이스케이프 해제 (\; \, \\ \n) */
function unescapeVCardValue(value: string): string {
  return value.replace(/\\([;,\\nN])/g, (_, char) =>
    char === "n" || char === "N" ? "\n" : char
  );
}

/**
 * ORG는 "회사;부서;팀" 구조라 첫 조각만 그룹 이름으로 쓴다.
 * 아이폰은 부서가 없어도 "연꾸재단;" 처럼 세미콜론을 남겨 보낸다.
 */
function parseOrgField(value: string): {
  org?: string;
  rest?: string[];
} {
  const parts = value
    .split(/(?<!\\);/)
    .map(part => unescapeVCardValue(part).trim());

  // 첫 조각이 비어 있으면(";영업부") 회사명이 없는 것이므로 그대로 둔다
  const org = parts[0] || undefined;
  const rest = parts.slice(1).filter(part => part.length > 0);

  return { org, rest: rest.length > 0 ? rest : undefined };
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
    if (
      !trimmed ||
      trimmed.startsWith("BEGIN:") ||
      trimmed.startsWith("END:")
    ) {
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
    // 아이폰은 "item1.TEL", "item2.EMAIL" 처럼 그룹 접두사를 붙여 내보낸다.
    // 접두사를 떼지 않으면 전화·이메일이 앱에서 통째로 누락된다.
    const fieldName = stripGroupPrefix(parts[0]).toUpperCase();
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

    if (
      encoding.toUpperCase() === "QUOTED-PRINTABLE" ||
      isQuotedPrintable(value)
    ) {
      try {
        value = decodeQuotedPrintable(value, charset);
      } catch (error) {
        console.warn(
          `Failed to decode Quoted-Printable for ${fieldName}:`,
          error
        );
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
  const parts = nValue
    .split(/(?<!\\);/)
    .map(part => unescapeVCardValue(part).trim());
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
function getFirstFieldValue(
  fieldArray: FieldValue[] | undefined
): string | undefined {
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
    const tel = telArray.map(t => t.value || "").filter(t => t);
    const email = emailArray.map(e => e.value || "").filter(e => e);

    const orgValue = getFirstFieldValue(fields.get("ORG"));
    const noteValue = getFirstFieldValue(fields.get("NOTE"));
    const parsedOrg = orgValue ? parseOrgField(orgValue) : undefined;

    const contact: Contact = {
      id: nanoid(),
      fn: unescapeVCardValue(fnValue),
      n: nFieldValue ? parseNField(nFieldValue) : undefined,
      org: parsedOrg?.org,
      orgRest: parsedOrg?.rest,
      tel,
      email,
      note: noteValue ? unescapeVCardValue(noteValue) : undefined,
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
 * Fields managed by this app — these are replaced with current values on export.
 * All other fields from rawVCard are preserved as-is.
 */
const MANAGED_FIELDS = new Set([
  "FN",
  "N",
  "ORG",
  "TEL",
  "EMAIL",
  "NOTE",
  "VERSION",
  "PRODID",
]);

/**
 * 원본에서 그대로 옮겨 담는 필드(주소, 생일 등)를 vCard 3.0에 맞게 손본다.
 *
 * vCard 2.1 파일은 한글 값을 CHARSET=EUC-KR;ENCODING=QUOTED-PRINTABLE로 싸서
 * 보내는데, 3.0에는 그 파라미터가 없다. 그대로 복사하면 내보낸 파일에서
 * 주소·생일 같은 필드가 깨져 보이므로 값을 풀어 UTF-8 평문으로 바꾼다.
 */
function normalizePreservedLine(line: string): string {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) return line;

  const header = line.substring(0, colonIndex);
  if (!/ENCODING=QUOTED-PRINTABLE/i.test(header)) return line;

  const charset = extractCharset(header);

  // ADR처럼 ";"로 구성요소를 나누는 필드가 있다.
  // 구분자는 그대로 두고 각 조각만 디코딩해야, 값 안에 있던 세미콜론(=3B)이
  // 풀리면서 구분자로 오인돼 주소 칸이 밀리는 일을 막을 수 있다.
  const value = line
    .substring(colonIndex + 1)
    .split(/([;,])/)
    .map((segment, index) => {
      // 홀수 번째는 원래부터 구분자였던 자리
      if (index % 2 === 1) return segment;
      const decoded = decodeQuotedPrintable(segment, charset).replace(
        /\r\n|\r/g,
        "\n"
      );
      return escapeVCardValue(decoded);
    })
    .join("");
  const cleanedHeader = header
    .split(";")
    .filter(part => !/^\s*(ENCODING|CHARSET)=/i.test(part))
    .join(";");

  return `${cleanedHeader}:${value}`;
}

/**
 * Build managed vCard lines from a Contact object
 */
function buildManagedLines(contact: Contact): string[] {
  const lines: string[] = [];

  // FN (Formatted Name) - required
  lines.push(...foldLine(`FN:${escapeVCardValue(contact.fn)}`));

  // N (Structured Name)
  //
  // 아이폰·구글 연락처는 이름을 표시할 때 FN이 아니라 N(성/이름)을 기준으로
  // 다시 만든다. 원본 성/이름을 그대로 두면 폰에서 꾸미기 전 이름으로 되돌아가
  // "고쳤는데 안 바뀐" 것처럼 보인다. 그래서 성 칸에 표시 이름 전체를 넣어
  // 어느 기기에서든 꾸민 이름 그대로 보이게 한다.
  lines.push(...foldLine(`N:${escapeVCardValue(contact.fn)};;;;`));

  // ORG (Organization) - 부서/팀 같은 나머지 구성요소는 원본대로 되돌린다
  if (contact.org || contact.orgRest?.length) {
    const orgParts = [contact.org ?? "", ...(contact.orgRest ?? [])];
    lines.push(...foldLine(`ORG:${orgParts.map(escapeVCardValue).join(";")}`));
  }

  // TEL (Telephone)
  for (const tel of contact.tel ?? []) {
    if (tel.trim()) lines.push(...foldLine(`TEL:${escapeVCardValue(tel)}`));
  }

  // EMAIL
  for (const email of contact.email ?? []) {
    if (email.trim())
      lines.push(...foldLine(`EMAIL:${escapeVCardValue(email)}`));
  }

  // NOTE
  if (contact.note) {
    lines.push(...foldLine(`NOTE:${escapeVCardValue(contact.note)}`));
  }

  return lines;
}

/**
 * Serialize Contact to vCard 3.0 format.
 * If rawVCard exists, preserves all original fields (ADR, BDAY, PHOTO, etc.)
 * and only replaces the fields managed by this app.
 */
export function contactToVCard(contact: Contact): string {
  const lines: string[] = [];

  lines.push("BEGIN:VCARD");
  lines.push("VERSION:3.0");
  lines.push("PRODID:-//Yeonkku//vCard Editor//EN");

  // Managed fields (always use current app state)
  lines.push(...buildManagedLines(contact));

  // Preserved fields from original rawVCard (ADR, BDAY, PHOTO, X-* etc.)
  if (contact.rawVCard) {
    const rawLines = unfoldLines(contact.rawVCard);

    // "item1.TEL" 처럼 그룹에 묶인 전화·이메일은 위에서 이미 다시 썼다.
    // 남은 라벨(item1.X-ABLabel)은 가리킬 대상이 없으므로 함께 걷어낸다.
    // 같은 그룹에 주소·URL 같은 다른 필드가 있을 수 있어 라벨만 골라 지운다.
    const consumedGroups = new Set<string>();
    for (const line of rawLines) {
      const head = line.trim().toUpperCase().split(/[;:]/)[0];
      const dotIndex = head.indexOf(".");
      if (dotIndex > -1 && MANAGED_FIELDS.has(head.substring(dotIndex + 1))) {
        consumedGroups.add(head.substring(0, dotIndex));
      }
    }

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const upper = trimmed.toUpperCase();
      if (upper.startsWith("BEGIN:VCARD") || upper.startsWith("END:VCARD"))
        continue;

      const head = upper.split(/[;:]/)[0];
      const dotIndex = head.indexOf(".");
      const group = dotIndex > -1 ? head.substring(0, dotIndex) : "";
      const fieldName = dotIndex > -1 ? head.substring(dotIndex + 1) : head;

      if (MANAGED_FIELDS.has(fieldName)) continue;
      if (group && consumedGroups.has(group) && fieldName.startsWith("X-AB"))
        continue;

      lines.push(...foldLine(normalizePreservedLine(trimmed)));
    }
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

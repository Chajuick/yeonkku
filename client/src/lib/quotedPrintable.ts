/**
 * Quoted-Printable Decoder
 * Handles RFC 2045 Quoted-Printable encoding used in vCard 2.1
 */

/**
 * Decode Quoted-Printable string
 * Handles soft line breaks (=\r\n or =\n) and hex escapes (=XX)
 */
export function decodeQuotedPrintable(
  encoded: string,
  charset: string = "utf-8"
): string {
  // Step 1: Remove soft line breaks (=\r\n or =\n)
  let text = encoded.replace(/=\r\n/g, "").replace(/=\n/g, "");

  // Step 2: Convert =XX hex sequences to bytes
  const bytes: number[] = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === "=" && i + 2 < text.length) {
      const hex = text.substring(i + 1, i + 3);
      // Check if it's valid hex
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        bytes.push(parseInt(hex, 16));
        i += 3;
        continue;
      }
    }

    // Regular character - convert to UTF-8 bytes
    const char = text[i];
    const charCode = char.charCodeAt(0);

    if (charCode < 0x80) {
      bytes.push(charCode);
    } else {
      // Multi-byte UTF-8 character
      const encoded = new TextEncoder().encode(char);
      for (let j = 0; j < encoded.length; j++) {
        bytes.push(encoded[j]);
      }
    }

    i++;
  }

  // Step 3: 지정된 charset으로 바이트를 문자열로 되돌린다
  return decodeBytes(new Uint8Array(bytes), charset);
}

/**
 * charset 이름 정규화. 한국 휴대폰은 EUC-KR을 여러 이름으로 적는다.
 */
function normalizeCharset(charset: string): string {
  const normalized = charset.trim().toLowerCase().replace(/^"|"$/g, "");

  if (/^(euc-?kr|cp949|ms949|ks_c_5601(-1987)?|korean)$/.test(normalized)) {
    return "euc-kr";
  }
  if (/^utf-?8$/.test(normalized)) return "utf-8";
  return normalized;
}

/**
 * 바이트열을 charset에 맞춰 디코딩한다.
 *
 * CHARSET을 UTF-8로 적어 놓고 실제로는 EUC-KR 바이트를 담아 보내는 기기가 있어서,
 * 대체 문자(U+FFFD)가 섞이면 EUC-KR로 한 번 더 시도한다.
 */
function decodeBytes(bytes: Uint8Array, charset: string): string {
  const normalized = normalizeCharset(charset);

  const decoded = tryDecode(bytes, normalized) ?? tryDecode(bytes, "utf-8");
  if (decoded === null) return "";

  if (decoded.includes("\uFFFD") && normalized !== "euc-kr") {
    const fallback = tryDecode(bytes, "euc-kr");
    if (fallback !== null && !fallback.includes("\uFFFD")) return fallback;
  }

  return decoded;
}

/** 브라우저가 모르는 charset 이름이면 null */
function tryDecode(bytes: Uint8Array, charset: string): string | null {
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return null;
  }
}

/**
 * Check if string is Quoted-Printable encoded
 */
export function isQuotedPrintable(text: string): boolean {
  return /=([0-9A-Fa-f]{2}|[\r\n])/.test(text);
}

/**
 * Extract charset from vCard field
 * Example: "CHARSET=UTF-8" or "CHARSET=EUC-KR"
 */
export function extractCharset(fieldLine: string): string {
  const match = fieldLine.match(/CHARSET=([^;:]+)/i);
  return match ? match[1].trim() : "utf-8";
}

/**
 * Extract encoding type from vCard field
 * Example: "ENCODING=QUOTED-PRINTABLE"
 */
export function extractEncoding(fieldLine: string): string {
  const match = fieldLine.match(/ENCODING=([^;:]+)/i);
  return match ? match[1].trim().toUpperCase() : "";
}

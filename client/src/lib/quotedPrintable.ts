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

  // Step 3: Decode bytes using specified charset
  const uint8Array = new Uint8Array(bytes);

  try {
    // Try to decode with specified charset
    if (charset.toLowerCase() === "utf-8" || charset.toLowerCase() === "utf8") {
      return new TextDecoder("utf-8").decode(uint8Array);
    } else if (charset.toLowerCase() === "euc-kr") {
      // For EUC-KR, we need to handle it specially
      return decodeEUCKR(uint8Array);
    } else {
      // Fallback to UTF-8
      return new TextDecoder("utf-8").decode(uint8Array);
    }
  } catch (error) {
    console.warn(
      `Failed to decode with charset ${charset}, falling back to UTF-8`,
      error
    );
    return new TextDecoder("utf-8", { fatal: false }).decode(uint8Array);
  }
}

/**
 * Decode EUC-KR encoded bytes
 * EUC-KR is a common Korean encoding in older vCard files
 */
function decodeEUCKR(bytes: Uint8Array): string {
  let result = "";
  let i = 0;

  while (i < bytes.length) {
    const byte1 = bytes[i];

    // Single-byte ASCII
    if (byte1 < 0x80) {
      result += String.fromCharCode(byte1);
      i++;
    }
    // Two-byte EUC-KR character
    else if (byte1 >= 0xa1 && byte1 <= 0xfe && i + 1 < bytes.length) {
      const byte2 = bytes[i + 1];
      if (byte2 >= 0xa1 && byte2 <= 0xfe) {
        // Decode EUC-KR to Unicode
        const code = (byte1 - 0xa1) * 94 + (byte2 - 0xa1) + 0xac00;
        if (code >= 0xac00 && code <= 0xd7a3) {
          result += String.fromCharCode(code);
          i += 2;
          continue;
        }
      }
    }

    // Fallback: treat as single byte
    result += String.fromCharCode(byte1);
    i++;
  }

  return result;
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

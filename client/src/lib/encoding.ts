/**
 * .vcf 파일 바이트를 문자열로 디코딩한다.
 *
 * 한국 휴대폰·PC에서 내보낸 연락처 파일은 UTF-8이 아니라 CP949(EUC-KR)인
 * 경우가 흔하다. File.text()는 항상 UTF-8로 읽기 때문에 그런 파일은
 * "홍길동" 대신 "?????" 같은 대체 문자(U+FFFD)로 깨진다.
 */

const UTF8_BOM = [0xef, 0xbb, 0xbf];
const UTF16LE_BOM = [0xff, 0xfe];
const UTF16BE_BOM = [0xfe, 0xff];

function startsWith(bytes: Uint8Array, prefix: number[]): boolean {
  return prefix.every((byte, i) => bytes[i] === byte);
}

/** 바이트열이 올바른 UTF-8인지 검사 */
function isValidUtf8(bytes: Uint8Array): boolean {
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return true;
  } catch {
    return false;
  }
}

export interface DecodedFile {
  text: string;
  /** 실제로 사용한 인코딩 (문제 안내용) */
  charset: string;
}

/**
 * BOM → UTF-8 유효성 → EUC-KR 순으로 판별한다.
 * Quoted-Printable(=XX)로 감싼 파일은 본문이 전부 ASCII라 UTF-8로 통과하고,
 * 실제 한글 디코딩은 필드별 CHARSET에 따라 QP 디코더가 처리한다.
 */
export function decodeVcfBytes(buffer: ArrayBuffer): DecodedFile {
  const bytes = new Uint8Array(buffer);

  if (startsWith(bytes, UTF8_BOM)) {
    return { text: new TextDecoder("utf-8").decode(bytes), charset: "utf-8" };
  }
  if (startsWith(bytes, UTF16LE_BOM)) {
    return {
      text: new TextDecoder("utf-16le").decode(bytes),
      charset: "utf-16le",
    };
  }
  if (startsWith(bytes, UTF16BE_BOM)) {
    return {
      text: new TextDecoder("utf-16be").decode(bytes),
      charset: "utf-16be",
    };
  }

  if (isValidUtf8(bytes)) {
    return { text: new TextDecoder("utf-8").decode(bytes), charset: "utf-8" };
  }

  // UTF-8이 아니면 한국어 파일에서 압도적으로 흔한 CP949로 읽는다.
  try {
    return { text: new TextDecoder("euc-kr").decode(bytes), charset: "euc-kr" };
  } catch {
    return { text: new TextDecoder("utf-8").decode(bytes), charset: "utf-8" };
  }
}

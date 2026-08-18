import { PrefixSuffixItem } from "@/../../shared/types";
import { nanoid } from "nanoid";

/**
 * 첫 방문자가 파일 없이도 앱을 둘러볼 수 있게 하는 샘플 데이터.
 *
 * 이 앱이 풀려는 문제가 "사람마다 다르게 저장된 이름 표기"이므로,
 * 샘플 FN도 일부러 형식을 제각각으로 넣어 정리 전/후가 드러나게 한다.
 */
export const SAMPLE_VCF = `BEGIN:VCARD
VERSION:3.0
FN:[연꾸사] 김민수님
N:김;민수;;;
ORG:연꾸사
TEL:010-1234-5678
EMAIL:minsu@example.com
NOTE:샘플 연락처입니다
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:연꾸사-이서연 님
N:이;서연;;;
ORG:연꾸사
TEL:010-2345-6789
EMAIL:seoyeon@example.com
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:박준호
N:박;준호;;;
ORG:연꾸사
TEL:010-3456-7890
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:하늘디자인 정하늘님
N:정;하늘;;;
ORG:하늘디자인
TEL:010-5678-9012
END:VCARD
BEGIN:VCARD
VERSION:3.0
FN:최지우
N:최;지우;;;
TEL:010-4567-8901
EMAIL:jiwoo@example.com
END:VCARD
`;

/** 샘플과 함께 깔아주는 기본 Prefix (사용자 목록이 비어 있을 때만 사용) */
export function createSamplePrefixes(): PrefixSuffixItem[] {
  return [
    { id: nanoid(), text: "[연꾸사]", enabled: true, type: "prefix" },
    { id: nanoid(), text: "[하늘디자인]", enabled: false, type: "prefix" },
  ];
}

/** 샘플과 함께 깔아주는 기본 Suffix (사용자 목록이 비어 있을 때만 사용) */
export function createSampleSuffixes(): PrefixSuffixItem[] {
  return [
    { id: nanoid(), text: "님", enabled: true, type: "suffix" },
    { id: nanoid(), text: "✨", enabled: false, type: "suffix" },
  ];
}

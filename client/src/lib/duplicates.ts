import { Contact } from "@/../../shared/types";

/**
 * 중복 의심 연락처 탐지.
 *
 * 폰 연락처는 같은 사람이 형식만 다르게 여러 번 저장되는 일이 잦다.
 * 전화·이메일처럼 확실한 단서와, 이름이 겹치는 약한 단서를 함께 본다.
 */

export type DuplicateReason = "tel" | "email" | "name" | "nameSimilar";

export interface DuplicateGroup {
  /** 무시 목록에 저장하기 위한 안정적인 키 (연락처 id 정렬 후 결합) */
  key: string;
  contactIds: string[];
  reasons: DuplicateReason[];
  /** "이름 비슷함"으로 묶인 경우 실제로 겹친 부분 (근거 표시용) */
  nameFragments: string[];
}

/** 이름이 비슷한 것만으로 묶인 그룹인지 (근거가 약한 그룹) */
export function isWeakGroup(group: DuplicateGroup): boolean {
  return group.reasons.length === 1 && group.reasons[0] === "nameSimilar";
}

/**
 * 전화번호 비교용 정규화.
 * "+82-10-1234-5678", "010 1234 5678" 을 모두 "01012345678" 로 맞춘다.
 */
export function normalizePhone(raw: string): string {
  let value = raw.replace(/[^\d+]/g, "");

  if (value.startsWith("+82")) {
    value = `0${value.slice(3)}`;
  } else if (value.startsWith("82") && value.length >= 11) {
    value = `0${value.slice(2)}`;
  }

  return value.replace(/\D/g, "");
}

/** 이메일 비교용 정규화 */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * 이름 비교용 정규화.
 * "[연꾸사] 홍길동님"과 "홍길동" 을 같은 축으로 놓기 위해
 * 공백·구두점·이모지를 모두 걷어낸다.
 */
export function normalizeName(raw: string): string {
  return raw.replace(/[\s\p{P}\p{S}]/gu, "").toLowerCase();
}

/** 이름 뒤에 습관적으로 붙는 존칭·직함. 길이 순으로 먼저 긴 것부터 떼어낸다. */
const HONORIFICS = [
  "선생님",
  "기사님",
  "대표님",
  "사장님",
  "부장님",
  "팀장님",
  "원장님",
  "교수님",
  "실장님",
  "선생",
  "대표",
  "사장",
  "부장",
  "차장",
  "과장",
  "대리",
  "팀장",
  "원장",
  "교수",
  "실장",
  "주임",
  "이사",
  "기사",
  "님",
  "씨",
].sort((a, b) => b.length - a.length);

/** [소속], (메모), <비고> 처럼 괄호로 감싼 덩어리 */
const BRACKET_GROUP = /[[(<{【][^\])>}】]*[\])>}】]/g;

/**
 * 이름에서 장식을 걷어내고 "사람 이름"에 해당하는 부분만 남긴다.
 *
 * "[기관명] 홍길동님" 처럼 저장하면 같은 기관 사람끼리 기관명이 통째로 겹쳐
 * 서로 중복 후보로 올라온다. 비교 전에 아래를 떼어낸다.
 * 1. 괄호로 감싼 덩어리   2. 연락처의 회사명   3. 사용자가 등록한 prefix/suffix
 * 4. 이름 뒤 존칭·직함
 */
export function extractCoreName(
  contact: Contact,
  decorations: string[] = []
): string {
  const fallback = normalizeName(contact.fn ?? "");

  let core = normalizeName((contact.fn ?? "").replace(BRACKET_GROUP, " "));

  const orgKey = normalizeName(contact.org ?? "");
  if (orgKey.length >= 2) {
    core = core.split(orgKey).join("");
  }

  for (const decoration of decorations) {
    const key = normalizeName(decoration);
    if (key.length >= 1) core = core.split(key).join("");
  }

  let trimmed = true;
  while (trimmed && core.length > 0) {
    trimmed = false;
    for (const honorific of HONORIFICS) {
      if (core.length > honorific.length && core.endsWith(honorific)) {
        core = core.slice(0, -honorific.length);
        trimmed = true;
        break;
      }
    }
  }

  return core || fallback;
}

/** 두 문자열에서 가장 긴 공통 연속 부분 (묶인 근거를 보여주기 위함) */
function longestCommonSubstring(a: string, b: string): string {
  let best = "";

  for (let i = 0; i < a.length; i++) {
    for (let j = i + best.length + 1; j <= a.length; j++) {
      const candidate = a.substring(i, j);
      if (b.includes(candidate)) {
        best = candidate;
      } else {
        break;
      }
    }
  }

  return best;
}

/** 같은 2-gram을 공유하는 후보만 비교하기 위한 블로킹 키 */
function bigrams(text: string): string[] {
  const result: string[] = [];
  for (let i = 0; i + 2 <= text.length; i++) {
    result.push(text.substring(i, i + 2));
  }
  return result;
}

/**
 * 흔한 2-gram(예: 성씨 + 흔한 음절)은 후보가 수백 개로 불어나 비교가 폭발한다.
 * 그런 묶음은 근거로서도 의미가 없어 건너뛴다.
 */
const MAX_BUCKET_SIZE = 300;

/**
 * 같은 번호·이메일을 여러 명이 공유하는 경우(대표번호, 회사 공용 메일)는
 * 중복이 아니라 "공용 연락처"다. 이걸 묶으면 수십 명이 한 그룹이 되고,
 * 합치기 한 번에 나머지가 전부 지워진다. 그래서 일정 인원을 넘으면 건너뛴다.
 */
const MAX_SHARED_CONTACT_SIZE = 5;

class UnionFind {
  private parent = new Map<string, string>();

  find(id: string): string {
    const parent = this.parent.get(id);
    if (parent === undefined) {
      this.parent.set(id, id);
      return id;
    }
    if (parent === id) return id;

    const root = this.find(parent);
    this.parent.set(id, root);
    return root;
  }

  union(a: string, b: string): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) this.parent.set(rootA, rootB);
  }
}

interface Options {
  /** 이름이 2자 이상 연달아 겹치는 약한 단서까지 포함할지 */
  includeSimilarNames: boolean;
  /** 사용자가 등록해 둔 prefix/suffix 텍스트 (이름 비교 전에 떼어낸다) */
  decorations?: string[];
}

/**
 * 중복 의심 그룹을 찾는다.
 *
 * 전화/이메일/이름 완전일치는 해시로 O(n)에 묶고,
 * 이름 부분일치는 2-gram이 겹치는 후보끼리만 비교한다.
 */
export function findDuplicateGroups(
  contacts: Contact[],
  options: Options = { includeSimilarNames: true }
): DuplicateGroup[] {
  const unionFind = new UnionFind();
  const reasonsByPair = new Map<string, Set<DuplicateReason>>();
  const fragmentByPair = new Map<string, string>();

  const link = (
    a: string,
    b: string,
    reason: DuplicateReason,
    fragment?: string
  ) => {
    if (a === b) return;
    unionFind.union(a, b);

    const pairKey = [a, b].sort().join("|");
    const reasons = reasonsByPair.get(pairKey) ?? new Set<DuplicateReason>();
    reasons.add(reason);
    reasonsByPair.set(pairKey, reasons);
    if (fragment) fragmentByPair.set(pairKey, fragment);
  };

  const linkBuckets = (
    buckets: Map<string, string[]>,
    reason: DuplicateReason,
    maxSize = Number.POSITIVE_INFINITY
  ) => {
    for (const ids of buckets.values()) {
      if (ids.length > maxSize) continue;

      for (let i = 1; i < ids.length; i++) {
        link(ids[0], ids[i], reason);
      }
    }
  };

  const telBuckets = new Map<string, string[]>();
  const emailBuckets = new Map<string, string[]>();
  const nameBuckets = new Map<string, string[]>();
  const bigramBuckets = new Map<string, string[]>();

  const pushTo = (map: Map<string, string[]>, key: string, id: string) => {
    if (!key) return;
    const list = map.get(key);
    if (list) {
      list.push(id);
    } else {
      map.set(key, [id]);
    }
  };

  // 기관명·존칭을 떼어낸 "핵심 이름"으로 비교한다.
  // 그래야 "[기관명] 김민수님"과 "[기관명] 이서연님"이 기관명 때문에 묶이지 않는다.
  const coreNameById = new Map(
    contacts.map(contact => [
      contact.id,
      extractCoreName(contact, options.decorations ?? []),
    ])
  );

  for (const contact of contacts) {
    for (const tel of contact.tel ?? []) {
      pushTo(telBuckets, normalizePhone(tel), contact.id);
    }
    for (const email of contact.email ?? []) {
      pushTo(emailBuckets, normalizeEmail(email), contact.id);
    }

    const name = coreNameById.get(contact.id) ?? "";
    pushTo(nameBuckets, name, contact.id);

    if (options.includeSimilarNames && name.length >= 2) {
      for (const gram of new Set(bigrams(name))) {
        pushTo(bigramBuckets, gram, contact.id);
      }
    }
  }

  linkBuckets(telBuckets, "tel", MAX_SHARED_CONTACT_SIZE);
  linkBuckets(emailBuckets, "email", MAX_SHARED_CONTACT_SIZE);
  linkBuckets(nameBuckets, "name");

  if (options.includeSimilarNames) {
    for (const ids of bigramBuckets.values()) {
      if (ids.length < 2 || ids.length > MAX_BUCKET_SIZE) continue;

      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const nameA = coreNameById.get(ids[i]) ?? "";
          const nameB = coreNameById.get(ids[j]) ?? "";

          // 이름이 완전히 같은 쌍은 이미 "name"으로 묶였다
          if (nameA === nameB) continue;

          const fragment = longestCommonSubstring(nameA, nameB);
          if (fragment.length < 2) continue;

          link(ids[i], ids[j], "nameSimilar", fragment);
        }
      }
    }
  }

  // 루트별로 모아 그룹으로 만든다
  const membersByRoot = new Map<string, string[]>();
  for (const contact of contacts) {
    const root = unionFind.find(contact.id);
    pushTo(membersByRoot, root, contact.id);
  }

  // 근거를 그룹(루트)별로 먼저 모아둔다.
  // 그룹마다 전체 쌍을 훑으면 중복이 많은 파일에서 비교 횟수가 제곱으로 늘어난다.
  const reasonsByRoot = new Map<
    string,
    { reasons: Set<DuplicateReason>; fragments: Set<string> }
  >();

  for (const [pairKey, pairReasons] of reasonsByPair) {
    const root = unionFind.find(pairKey.split("|")[0]);
    const entry = reasonsByRoot.get(root) ?? {
      reasons: new Set<DuplicateReason>(),
      fragments: new Set<string>(),
    };

    for (const reason of pairReasons) entry.reasons.add(reason);

    const fragment = fragmentByPair.get(pairKey);
    if (fragment) entry.fragments.add(fragment);

    reasonsByRoot.set(root, entry);
  }

  const groups: DuplicateGroup[] = [];
  for (const [root, members] of membersByRoot) {
    if (members.length < 2) continue;

    const entry = reasonsByRoot.get(root);
    const contactIds = [...members].sort();

    groups.push({
      key: contactIds.join("|"),
      contactIds,
      reasons: [...(entry?.reasons ?? [])],
      nameFragments: [...(entry?.fragments ?? [])].slice(0, 3),
    });
  }

  // 근거가 확실한 그룹을 위로
  return groups.sort((a, b) => {
    const weakDiff = Number(isWeakGroup(a)) - Number(isWeakGroup(b));
    if (weakDiff !== 0) return weakDiff;
    return b.contactIds.length - a.contactIds.length;
  });
}

function uniqueBy(
  values: string[],
  normalize: (v: string) => string
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const key = normalize(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }

  return result;
}

/**
 * 대표 연락처에 나머지 정보를 합친다.
 *
 * 이름·회사처럼 하나만 남길 수 있는 값은 대표 것을 쓰되, 대표가 비어 있으면
 * 다른 연락처에서 채운다. 전화·이메일은 모두 모아 중복만 제거한다.
 */
export function mergeContacts(primary: Contact, others: Contact[]): Contact {
  const all = [primary, ...others];

  return {
    ...primary,
    org: primary.org || others.find(c => c.org)?.org,
    note: primary.note || others.find(c => c.note)?.note,
    n: primary.n ?? others.find(c => c.n)?.n,
    tel: uniqueBy(
      all.flatMap(c => c.tel ?? []),
      normalizePhone
    ),
    email: uniqueBy(
      all.flatMap(c => c.email ?? []),
      normalizeEmail
    ),
  };
}

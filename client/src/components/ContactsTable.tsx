import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Contact } from "@/../../shared/types";
import { useIsMobile } from "@/hooks/useMobile";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface ContactsTableProps {
  contacts: Contact[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onContactUpdate: (contact: Contact) => void;
  onContactDelete: (id: string) => void;
}

type SortKey = keyof Contact | "tel" | "email";

/** 한 번에 그리는 최대 행 수. 수천 건이 한꺼번에 들어와도 화면이 멈추지 않게 */
const PAGE_SIZE = 100;

export default function ContactsTable({
  contacts,
  selectedIds,
  onSelectionChange,
  onContactUpdate,
  onContactDelete,
}: ContactsTableProps) {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<"fn" | "org" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({ key: "fn", direction: "asc" });

  // Unique company list for filter dropdown
  const uniqueCompanies = useMemo(
    () =>
      Array.from(
        new Set(
          contacts.map(c => c.org).filter((org): org is string => Boolean(org))
        )
      ).sort((a, b) => a.localeCompare(b, "ko")),
    [contacts]
  );

  // Filter contacts based on search term and company filter
  const filteredContacts = useMemo(() => {
    const searchLower = searchTerm.trim().toLowerCase();
    return contacts.filter(contact => {
      const searchMatch =
        !searchLower ||
        contact.fn.toLowerCase().includes(searchLower) ||
        contact.org?.toLowerCase().includes(searchLower) ||
        contact.tel?.some(t => t.toLowerCase().includes(searchLower)) ||
        contact.email?.some(e => e.toLowerCase().includes(searchLower));
      const companyMatch =
        companyFilter === "all" || contact.org === companyFilter;
      return searchMatch && companyMatch;
    });
  }, [contacts, searchTerm, companyFilter]);

  // Sort contacts
  const sortedContacts = useMemo(() => {
    const key = sortConfig.key;
    const valueOf = (c: Contact): string => {
      if (key === "tel") return c.tel?.[0] || "";
      if (key === "email") return c.email?.[0] || "";
      return String(c[key] || "");
    };

    return [...filteredContacts].sort((a, b) => {
      const comparison = valueOf(a).localeCompare(valueOf(b), "ko");
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredContacts, sortConfig]);

  // 검색어나 필터가 바뀌면 다시 처음부터 보여준다
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, companyFilter]);

  const visibleContacts = sortedContacts.slice(0, visibleCount);
  const allSelected =
    sortedContacts.length > 0 &&
    sortedContacts.every(c => selectedIds.has(c.id));

  // 화면에 보이는 만큼이 아니라 "지금 걸러진 전부"를 고른다
  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(
      checked ? new Set(sortedContacts.map(c => c.id)) : new Set()
    );
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedIds);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    onSelectionChange(newSelection);
  };

  // Handle inline editing
  const startEdit = (contact: Contact, field: "fn" | "org") => {
    setEditingId(contact.id);
    setEditingField(field);
    setEditValue(field === "fn" ? contact.fn : (contact.org ?? ""));
  };

  const saveEdit = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    const next = editValue.trim();

    // 값이 그대로면 조용히 닫는다. 칸을 빠져나올 때마다 토스트가 뜨면 시끄럽다
    if (contact) {
      if (editingField === "fn" && next && next !== contact.fn) {
        onContactUpdate({ ...contact, fn: next });
        toast.success(i18n.contactsUpdated);
      } else if (editingField === "org" && next !== (contact.org ?? "")) {
        onContactUpdate({ ...contact, org: next || undefined });
        toast.success(i18n.contactsUpdated);
      }
    }
    setEditingId(null);
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
  };

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const isEditing = (contact: Contact, field: "fn" | "org") =>
    editingId === contact.id && editingField === field;

  /**
   * 인라인 편집 입력칸 (표와 카드가 같이 쓴다).
   *
   * 컴포넌트가 아니라 그냥 JSX를 돌려주는 함수다. 컴포넌트로 만들면 글자를
   * 칠 때마다 새 타입이 생겨 input이 다시 마운트되고 포커스가 날아간다.
   */
  const renderEditBox = (contact: Contact, placeholder?: string) => (
    <div className="flex gap-1.5">
      <Input
        ref={editInputRef}
        value={editValue}
        onChange={e => setEditValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") saveEdit(contact.id);
          if (e.key === "Escape") cancelEdit();
        }}
        onBlur={() => saveEdit(contact.id)}
        placeholder={placeholder}
        className="h-9 rounded-lg"
      />
      <Button
        size="sm"
        onMouseDown={e => e.preventDefault()}
        onClick={() => saveEdit(contact.id)}
        className="press h-9 shrink-0 rounded-lg"
      >
        저장
      </Button>
    </div>
  );

  const SortHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: SortKey;
  }) => {
    const active = sortConfig.key === sortKey;
    return (
      <button
        onClick={() => handleSort(sortKey)}
        className={`flex items-center gap-1 transition-colors hover:text-foreground ${
          active ? "text-foreground" : ""
        }`}
      >
        {label}
        {active ? (
          sortConfig.direction === "asc" ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </button>
    );
  };

  const emptyState = (
    <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <UserRound className="h-5 w-5 text-muted-foreground" />
      </span>
      <p className="text-sm font-medium">{i18n.contactsEmpty}</p>
      {(searchTerm || companyFilter !== "all") && (
        <Button
          variant="ghost"
          size="sm"
          className="press rounded-lg"
          onClick={() => {
            setSearchTerm("");
            setCompanyFilter("all");
          }}
        >
          조건 초기화
        </Button>
      )}
    </div>
  );

  return (
    <Card className="gap-4 overflow-hidden">
      <CardContent className="space-y-3 px-4 sm:px-6">
        {/* 검색 + 그룹 필터 */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={i18n.contactsSearch}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-12 rounded-xl border-transparent bg-muted pl-11 pr-10"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="검색어 지우기"
                className="press absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/10 text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {uniqueCompanies.length > 0 && (
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="h-12 w-full rounded-xl border-transparent bg-muted px-4 sm:w-48">
                <SelectValue placeholder={i18n.filterAllCompanies} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">{i18n.filterAllCompanies}</SelectItem>
                {uniqueCompanies.map(company => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* 전체 선택 줄 — 개수와 선택 상태를 한 줄에 모은다 */}
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-2.5">
          <Checkbox
            id="select-all-contacts"
            checked={allSelected}
            onCheckedChange={checked => handleSelectAll(Boolean(checked))}
            disabled={sortedContacts.length === 0}
          />
          <label
            htmlFor="select-all-contacts"
            className="text-sm font-medium select-none"
          >
            모두 선택
          </label>
          <span className="tabular ml-auto text-sm text-muted-foreground">
            {selectedIds.size > 0 ? (
              <span className="font-semibold text-primary">
                {selectedIds.size}
                {i18n.contactsSelected}
              </span>
            ) : (
              <>
                {filteredContacts.length}
                {i18n.contactsCount}
              </>
            )}
          </span>
        </div>
      </CardContent>

      {sortedContacts.length === 0 ? (
        emptyState
      ) : isMobile ? (
        /* ── 모바일: 표 대신 카드 목록 ─────────────────────────────── */
        <ul className="divide-y border-t">
          {visibleContacts.map(contact => {
            const selected = selectedIds.has(contact.id);
            return (
              <li
                key={contact.id}
                className={`flex gap-3 px-4 py-3 transition-colors ${
                  selected ? "bg-primary/6" : ""
                }`}
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={checked =>
                    handleSelectOne(contact.id, Boolean(checked))
                  }
                  className="mt-1"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  {isEditing(contact, "fn") ? (
                    renderEditBox(contact)
                  ) : (
                    <button
                      onClick={() => startEdit(contact, "fn")}
                      className="block max-w-full truncate text-left text-[15px] font-semibold"
                    >
                      {contact.fn}
                    </button>
                  )}

                  {isEditing(contact, "org") ? (
                    renderEditBox(contact, "그룹명 입력")
                  ) : (
                    <button
                      onClick={() => startEdit(contact, "org")}
                      className="block max-w-full truncate text-left text-xs"
                    >
                      {contact.org ? (
                        <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium text-secondary-foreground">
                          {contact.org}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          그룹 없음 · 눌러서 지정
                        </span>
                      )}
                    </button>
                  )}

                  <p className="break-anywhere text-xs text-muted-foreground">
                    {[contact.tel?.[0], contact.email?.[0]]
                      .filter(Boolean)
                      .join(" · ") || "연락처 정보 없음"}
                  </p>
                </div>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label={`${contact.fn} 삭제`}
                  onClick={() => onContactDelete(contact.id)}
                  className="press mt-0.5 shrink-0 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        /* ── 데스크톱: 표 ──────────────────────────────────────────── */
        <div className="overflow-x-auto border-t">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs text-muted-foreground">
                <th className="w-12 px-4 py-3" />
                <th className="px-3 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTableName} sortKey="fn" />
                </th>
                <th className="px-3 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTableOrg} sortKey="org" />
                </th>
                <th className="px-3 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTablePhone} sortKey="tel" />
                </th>
                <th className="px-3 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTableEmail} sortKey="email" />
                </th>
                <th className="px-3 py-3 text-left font-medium">
                  {i18n.contactsTableNote}
                </th>
                <th className="w-14 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {visibleContacts.map(contact => {
                const selected = selectedIds.has(contact.id);
                return (
                  <tr
                    key={contact.id}
                    className={`transition-colors ${
                      selected ? "bg-primary/6" : "hover:bg-muted/40"
                    }`}
                  >
                    <td className="px-4 py-2.5">
                      <Checkbox
                        checked={selected}
                        onCheckedChange={checked =>
                          handleSelectOne(contact.id, Boolean(checked))
                        }
                      />
                    </td>
                    <td className="px-3 py-2.5 font-medium">
                      {isEditing(contact, "fn") ? (
                        renderEditBox(contact)
                      ) : (
                        <button
                          onClick={() => startEdit(contact, "fn")}
                          className="max-w-[220px] truncate text-left hover:text-primary hover:underline"
                        >
                          {contact.fn}
                        </button>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {isEditing(contact, "org") ? (
                        renderEditBox(contact, "그룹명 입력")
                      ) : (
                        <button
                          onClick={() => startEdit(contact, "org")}
                          className="max-w-[160px] truncate text-left"
                        >
                          {contact.org ? (
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-secondary-foreground">
                              {contact.org}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </button>
                      )}
                    </td>
                    <td className="tabular px-3 py-2.5 text-muted-foreground">
                      {contact.tel?.[0] || "-"}
                    </td>
                    <td className="break-anywhere max-w-[200px] px-3 py-2.5 text-muted-foreground">
                      {contact.email?.[0] || "-"}
                    </td>
                    <td className="max-w-[160px] px-3 py-2.5 text-muted-foreground">
                      {contact.note ? (
                        <span title={contact.note} className="block truncate">
                          {contact.note}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`${contact.fn} 삭제`}
                        onClick={() => onContactDelete(contact.id)}
                        className="press rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {visibleCount < sortedContacts.length && (
        <div className="border-t px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => setVisibleCount(count => count + PAGE_SIZE)}
            className="press h-11 w-full rounded-xl font-semibold"
          >
            {sortedContacts.length - visibleCount}개 더 보기
          </Button>
        </div>
      )}
    </Card>
  );
}

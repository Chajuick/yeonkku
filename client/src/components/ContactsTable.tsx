import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "@/../../shared/types";
import { ChevronDown, ChevronUp, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface ContactsTableProps {
  contacts: Contact[];
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onContactUpdate: (contact: Contact) => void;
  onContactDelete: (id: string) => void;
}

/**
 * Contacts Table Component
 * Displays contacts in a spreadsheet-like table with inline editing
 */
export default function ContactsTable({
  contacts,
  selectedIds,
  onSelectionChange,
  onContactUpdate,
  onContactDelete,
}: ContactsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<"fn" | "org" | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Contact | "tel" | "email";
    direction: "asc" | "desc";
  }>({ key: "fn", direction: "asc" });

  // Unique company list for filter dropdown
  const uniqueCompanies = Array.from(new Set(
    contacts.map((c) => c.org).filter((org): org is string => Boolean(org))
  )).sort();

  // Filter contacts based on search term and company filter
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    const searchMatch =
      contact.fn.toLowerCase().includes(searchLower) ||
      contact.org?.toLowerCase().includes(searchLower) ||
      contact.tel?.some((t) => t.toLowerCase().includes(searchLower)) ||
      contact.email?.some((e) => e.toLowerCase().includes(searchLower));
    const companyMatch = companyFilter === "all" || contact.org === companyFilter;
    return searchMatch && companyMatch;
  });

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const key = sortConfig.key;
    let aVal: string = "";
    let bVal: string = "";

    if (key === "tel") {
      aVal = a.tel?.[0] || "";
      bVal = b.tel?.[0] || "";
    } else if (key === "email") {
      aVal = a.email?.[0] || "";
      bVal = b.email?.[0] || "";
    } else {
      aVal = String(a[key] || "");
      bVal = String(b[key] || "");
    }

    const comparison = aVal.localeCompare(bVal);
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(new Set(sortedContacts.map((c) => c.id)));
    } else {
      onSelectionChange(new Set());
    }
  };

  // Handle individual select
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
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      if (editingField === "fn" && editValue.trim()) {
        onContactUpdate({ ...contact, fn: editValue.trim() });
        toast.success(i18n.contactsUpdated);
      } else if (editingField === "org") {
        onContactUpdate({ ...contact, org: editValue.trim() || undefined });
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

  const handleSort = (key: keyof Contact | "tel" | "email") => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortHeader = ({
    label,
    sortKey,
  }: {
    label: string;
    sortKey: keyof Contact | "tel" | "email";
  }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-1 hover:text-primary transition-colors"
    >
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )
      )}
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {i18n.contactsTitle} ({filteredContacts.length}{i18n.contactsCount})
        </CardTitle>
        <CardDescription>
          {selectedIds.size > 0 && `${selectedIds.size}${i18n.contactsSelected}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search + Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={i18n.contactsSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {uniqueCompanies.length > 0 && (
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={i18n.filterAllCompanies} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{i18n.filterAllCompanies}</SelectItem>
                {uniqueCompanies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Checkbox
                    checked={
                      sortedContacts.length > 0 &&
                      sortedContacts.every((c) => selectedIds.has(c.id))
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTableName} sortKey="fn" />
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTableOrg} sortKey="org" />
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTablePhone} sortKey="tel" />
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  <SortHeader label={i18n.contactsTableEmail} sortKey="email" />
                </th>
                <th className="px-4 py-3 text-left font-medium">{i18n.contactsTableNote}</th>
                <th className="px-4 py-3 text-left font-medium">{i18n.contactsTableAction}</th>
              </tr>
            </thead>
            <tbody>
              {sortedContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    {i18n.contactsEmpty}
                  </td>
                </tr>
              ) : (
                sortedContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.has(contact.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(contact.id, checked as boolean)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {editingId === contact.id && editingField === "fn" ? (
                        <div className="flex gap-2">
                          <Input
                            ref={editInputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(contact.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="h-8"
                          />
                          <Button
                            size="sm"
                            onClick={() => saveEdit(contact.id)}
                            className="h-8"
                          >
                            저장
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(contact, "fn")}
                          className="hover:text-primary hover:underline text-left"
                        >
                          {contact.fn}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {editingId === contact.id && editingField === "org" ? (
                        <div className="flex gap-2">
                          <Input
                            ref={editInputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(contact.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="h-8"
                            placeholder="회사명 입력"
                          />
                          <Button
                            size="sm"
                            onClick={() => saveEdit(contact.id)}
                            className="h-8"
                          >
                            저장
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(contact, "org")}
                          className="hover:text-primary hover:underline text-left w-full text-left"
                        >
                          {contact.org || <span className="text-muted-foreground">-</span>}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {contact.tel?.[0] || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {contact.email?.[0] || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {contact.note ? (
                        <span title={contact.note} className="truncate block max-w-xs">
                          {contact.note}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onContactDelete(contact.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

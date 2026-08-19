import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import VcfExportGuide from "@/components/VcfExportGuide";
import VcfImporter from "@/components/VcfImporter";
import ContactsTable from "@/components/ContactsTable";
import PrefixSuffixManager from "@/components/PrefixSuffixManager";
import BatchActionsBar, { BatchTargetKind } from "@/components/BatchActionsBar";
import BatchPreviewModal from "@/components/BatchPreviewModal";
import ExportButton from "@/components/ExportButton";
import ConfirmModal from "@/components/ConfirmModal";
import DuplicateReview from "@/components/DuplicateReview";
import GroupManager from "@/components/GroupManager";
import PhoneApplyGuide from "@/components/PhoneApplyGuide";
import ThemeSelector from "@/components/ThemeSelector";
import WelcomeGuide from "@/components/WelcomeGuide";
import { useIndexedDBState } from "@/hooks/useIndexedDBState";
import { batchApplyPrefixSuffix } from "@/lib/batchApply";
import {
  DuplicateGroup,
  findDuplicateGroups,
  mergeContacts,
} from "@/lib/duplicates";
import {
  createSamplePrefixes,
  createSampleSuffixes,
  SAMPLE_VCF,
} from "@/lib/sampleData";
import { parseVCardText } from "@/lib/vcardParser";
import { Contact, PrefixSuffixItem } from "@/../../shared/types";
import {
  Settings,
  Trash2,
  BookOpen,
  Tags,
  Download,
  Lightbulb,
  Palette,
  Undo2,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";
import {
  TAB_LIST_CLASS,
  TAB_STEP_CLASS,
  TAB_TRIGGER_CLASS,
} from "@/lib/tabStyles";

/** 미리보기 확인을 기다리는 일괄 작업 */
type PendingBatch =
  | { kind: BatchTargetKind; mode: "add" | "remove"; item: PrefixSuffixItem }
  | { kind: "group"; groupName: string };

/** 첫 로딩 동안 보여줄 뼈대. 빈 화면에 글자 하나보다 덜 불안하다 */
function HomeSkeleton() {
  return (
    <div className="min-h-dvh app-bg">
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 pt-20 sm:px-6">
        <div className="h-12 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

/**
 * Main Home Page Component
 * Orchestrates all features: import, edit, manage prefixes/suffixes, batch apply, export
 */
export default function Home() {
  const {
    state,
    updateState,
    saveToUndo,
    undo,
    canUndo,
    resetState,
    isLoading,
  } = useIndexedDBState();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [includeSimilarNames, setIncludeSimilarNames] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingBatch | null>(null);

  // 훅은 아래 isLoading 조기 반환보다 위에 있어야 한다 (렌더마다 호출 수가 같아야 함)
  const contactsById = useMemo(
    () => new Map(state.contacts.map(contact => [contact.id, contact])),
    [state.contacts]
  );

  // 연락처가 바뀔 때만 다시 계산한다 (수천 건에서 매 렌더 돌면 버벅인다)
  // 사용자가 등록한 prefix/suffix는 이름이 아니라 장식이므로 비교 전에 떼어낸다
  const decorations = useMemo(
    () =>
      [
        ...state.prefixList,
        ...state.suffixList,
        ...state.orgPrefixList,
        ...state.orgSuffixList,
      ].map(item => item.text),
    [
      state.prefixList,
      state.suffixList,
      state.orgPrefixList,
      state.orgSuffixList,
    ]
  );

  const duplicateGroups = useMemo(() => {
    const ignored = new Set(state.ignoredDuplicateKeys ?? []);
    return findDuplicateGroups(state.contacts, {
      includeSimilarNames,
      decorations,
    }).filter(group => !ignored.has(group.key));
  }, [
    state.contacts,
    state.ignoredDuplicateKeys,
    includeSimilarNames,
    decorations,
  ]);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  // Handle import
  const handleImport = (contacts: Contact[]) => {
    updateState({
      contacts: [...state.contacts, ...contacts],
    });
    setSelectedIds(new Set());
  };

  // 파일이 없는 첫 방문자가 기능을 바로 체험할 수 있게 샘플을 채운다.
  // prefix/suffix는 사용자가 이미 만든 게 있으면 건드리지 않는다.
  const handleLoadSample = () => {
    const contacts = parseVCardText(SAMPLE_VCF);
    updateState({
      contacts,
      prefixList:
        state.prefixList.length > 0 ? state.prefixList : createSamplePrefixes(),
      suffixList:
        state.suffixList.length > 0 ? state.suffixList : createSampleSuffixes(),
    });
    setSelectedIds(new Set());
    toast.success(i18n.welcomeSampleLoaded, {
      description: i18n.welcomeSampleLoadedDesc,
    });
  };

  // Handle contact update
  const handleContactUpdate = (contact: Contact) => {
    updateState({
      contacts: state.contacts.map(c => (c.id === contact.id ? contact : c)),
    });
  };

  // Handle contact delete
  const handleContactDelete = (id: string) => {
    updateState({
      contacts: state.contacts.filter(c => c.id !== id),
    });
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // Handle prefix list change
  const handlePrefixChange = (prefixes: PrefixSuffixItem[]) => {
    updateState({ prefixList: prefixes });
  };

  // Handle suffix list change
  const handleSuffixChange = (suffixes: PrefixSuffixItem[]) => {
    updateState({ suffixList: suffixes });
  };

  // Handle org prefix list change
  const handleOrgPrefixChange = (prefixes: PrefixSuffixItem[]) => {
    updateState({ orgPrefixList: prefixes });
  };

  // Handle org suffix list change
  const handleOrgSuffixChange = (suffixes: PrefixSuffixItem[]) => {
    updateState({ orgSuffixList: suffixes });
  };

  // 고른 항목 하나만 담은 목록을 만들어 batchApply에 넘긴다.
  // (예전처럼 "켜 둔 항목 전부"가 아니라, 방금 고른 것만 적용된다)
  const listsForPending = (
    pending: Extract<PendingBatch, { mode: "add" | "remove" }>
  ) => {
    const only = (kind: BatchTargetKind) =>
      pending.kind === kind ? [{ ...pending.item, enabled: true }] : [];

    return {
      prefixList: only("prefix"),
      suffixList: only("suffix"),
      orgPrefixList: only("orgPrefix"),
      orgSuffixList: only("orgSuffix"),
    };
  };

  // 선택한 연락처의 그룹(ORG)을 통째로 바꾼다
  const applyGroup = (contacts: Contact[], groupName: string): Contact[] =>
    contacts.map(contact =>
      selectedIds.has(contact.id)
        ? { ...contact, org: groupName || undefined, orgRest: undefined }
        : contact
    );

  const runPending = (
    pending: PendingBatch,
    contacts: Contact[]
  ): Contact[] => {
    if (pending.kind === "group") {
      return applyGroup(contacts, pending.groupName);
    }

    const lists = listsForPending(pending);
    return batchApplyPrefixSuffix(
      contacts,
      selectedIds,
      lists.prefixList,
      lists.suffixList,
      lists.orgPrefixList,
      lists.orgSuffixList,
      pending.mode,
      state.settings
    );
  };

  // 붙이기/떼어내기 — 항목 하나를 고르면 미리보기를 먼저 띄운다
  const handleApplyItem = (
    kind: BatchTargetKind,
    mode: "add" | "remove",
    item: PrefixSuffixItem
  ) => {
    setPendingAction({ kind, mode, item });
    setPreviewOpen(true);
  };

  // 그룹 지정 — 빈 문자열이면 그룹 비우기.
  // 그룹 목록에 남기는 건 미리보기에서 확정한 뒤에 한다 (취소하면 아무것도 안 남게)
  const handleAssignGroup = (groupName: string) => {
    setPendingAction({ kind: "group", groupName });
    setPreviewOpen(true);
  };

  // Compute preview items for the modal
  const selectedContacts = state.contacts.filter(c => selectedIds.has(c.id));
  const previewItems = pendingAction
    ? runPending(pendingAction, selectedContacts).map((updated, i) => {
        const original = selectedContacts[i];
        return {
          id: updated.id,
          before: original.fn,
          after: updated.fn,
          orgBefore: original.org,
          orgAfter: updated.org,
        };
      })
    : [];

  // Actually apply after preview confirmation
  const handleConfirmApply = () => {
    if (!pendingAction) return;
    setPreviewOpen(false);
    saveToUndo();

    // 하단 바에서 즉석으로 만든 그룹도 목록에 남겨 다음에 다시 고를 수 있게 한다
    const isNewGroup =
      pendingAction.kind === "group" &&
      pendingAction.groupName &&
      !(state.groupList ?? []).includes(pendingAction.groupName);

    updateState({
      contacts: runPending(pendingAction, state.contacts),
      ...(isNewGroup && pendingAction.kind === "group"
        ? { groupList: [...(state.groupList ?? []), pendingAction.groupName] }
        : {}),
    });

    const message =
      pendingAction.kind === "group"
        ? `${selectedIds.size}${
            pendingAction.groupName
              ? i18n.batchGroupAssigned
              : i18n.batchGroupCleared
          }`
        : `${selectedIds.size}개 연락처에 ${
            pendingAction.mode === "add" ? "붙였습니다" : "떼어냈습니다"
          }`;

    toast.success(message, {
      action: {
        label: "되돌리기",
        onClick: undo,
      },
    });
    setPendingAction(null);
  };

  // Handle separator change (auto-save)
  const handleSeparatorChange = (
    key: "prefixSeparator" | "suffixSeparator",
    value: string
  ) => {
    updateState({
      settings: { ...state.settings, [key]: value },
    });
  };

  // 대표 연락처에 나머지를 합치고, 합쳐진 연락처는 목록에서 뺀다.
  const handleMergeDuplicates = (group: DuplicateGroup, primaryId: string) => {
    const members = group.contactIds
      .map(id => contactsById.get(id))
      .filter((c): c is Contact => Boolean(c));
    const primary = members.find(c => c.id === primaryId);
    if (!primary || members.length < 2) return;

    saveToUndo();

    const others = members.filter(c => c.id !== primaryId);
    const merged = mergeContacts(primary, others);
    const removedIds = new Set(others.map(c => c.id));

    updateState({
      contacts: state.contacts
        .filter(c => !removedIds.has(c.id))
        .map(c => (c.id === primary.id ? merged : c)),
    });
    setSelectedIds(new Set());

    toast.success(`${members.length}${i18n.dupMerged}`, {
      action: {
        label: "되돌리기",
        onClick: undo,
      },
    });
  };

  // "중복 아님"으로 넘긴 그룹은 다시 올라오지 않게 기억해 둔다.
  // 잘못 눌렀을 때 되살릴 방법이 없으면 곤란하므로 토스트에 되돌리기를 붙인다.
  const handleIgnoreDuplicates = (group: DuplicateGroup) => {
    const previous = state.ignoredDuplicateKeys ?? [];
    updateState({ ignoredDuplicateKeys: [...previous, group.key] });

    toast.success(i18n.dupIgnored, {
      action: {
        label: "되돌리기",
        onClick: () => updateState({ ignoredDuplicateKeys: previous }),
      },
    });
  };

  // 체크한 연락처 일괄 삭제. 되돌리기 스택에 먼저 담아 실수를 되살릴 수 있게 한다.
  const handleDeleteSelected = () => {
    saveToUndo();

    const deletedCount = selectedIds.size;
    updateState({
      contacts: state.contacts.filter(c => !selectedIds.has(c.id)),
    });
    setSelectedIds(new Set());
    setDeleteConfirmOpen(false);

    toast.success(`${deletedCount}${i18n.toastDeletedSelected}`, {
      action: {
        label: "되돌리기",
        onClick: undo,
      },
    });
  };

  // Handle reset
  const handleReset = async () => {
    await resetState();
    setSelectedIds(new Set());
    setConfirmOpen(false);
    toast.success("모든 데이터가 삭제되었습니다");
  };

  const hasContacts = state.contacts.length > 0;

  // 그룹별 연락처 수
  const countByGroup = new Map<string, number>();
  for (const contact of state.contacts) {
    const group = contact.org?.trim();
    if (group) countByGroup.set(group, (countByGroup.get(group) ?? 0) + 1);
  }

  // 미리 만들어 둔 그룹 + 연락처에서 실제로 쓰이는 그룹
  const existingGroups = [
    ...new Set([...(state.groupList ?? []), ...countByGroup.keys()]),
  ].sort((a, b) => a.localeCompare(b, "ko"));

  const handleAddGroup = (name: string) => {
    updateState({ groupList: [...(state.groupList ?? []), name] });
    toast.success(`"${name}" ${i18n.groupAdded}`);
  };

  // 목록에서만 빼고, 연락처에 지정된 그룹은 건드리지 않는다
  const handleRemoveGroup = (name: string) => {
    updateState({
      groupList: (state.groupList ?? []).filter(group => group !== name),
    });
  };

  return (
    <div className="min-h-dvh app-bg">
      {/* 상단 바 — 스크롤해도 앱 이름과 되돌리기는 항상 손에 닿는 자리에 둔다 */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              연
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight">
                {i18n.appTitle}
              </p>
              <p className="hidden truncate text-xs leading-tight text-muted-foreground sm:block">
                연락처 이름을 한 번에 정리해요
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {hasContacts && (
              <span className="tabular hidden rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-secondary-foreground sm:inline-block">
                {state.contacts.length}개
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="press h-9 rounded-xl px-3 text-muted-foreground"
            >
              <Undo2 className="h-4 w-4" />
              <span className="hidden sm:inline">되돌리기</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <Tabs defaultValue="contacts" className="gap-0">
          {/* 탭에 번호를 붙여 가져오기 → 꾸미기 → 내보내기 순서를 드러낸다.
              연락처가 없으면 2·3단계는 눌러도 빈 화면이라 잠가 둔다. */}
          <div className="sticky top-14 z-30 -mx-4 bg-background/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
            <TabsList className={`${TAB_LIST_CLASS} grid grid-cols-4`}>
              <TabsTrigger value="contacts" className={TAB_TRIGGER_CLASS}>
                <span className={TAB_STEP_CLASS}>1</span>
                <BookOpen className="hidden h-4 w-4 sm:block" />
                <span className="truncate">{i18n.tabContacts}</span>
              </TabsTrigger>
              <TabsTrigger
                value="prefixsuffix"
                disabled={!hasContacts}
                title={hasContacts ? undefined : i18n.tabLockedHint}
                className={TAB_TRIGGER_CLASS}
              >
                <span className={TAB_STEP_CLASS}>2</span>
                <Tags className="hidden h-4 w-4 sm:block" />
                <span className="truncate">{i18n.tabPrefixSuffix}</span>
              </TabsTrigger>
              <TabsTrigger
                value="export"
                disabled={!hasContacts}
                title={hasContacts ? undefined : i18n.tabLockedHint}
                className={TAB_TRIGGER_CLASS}
              >
                <span className={TAB_STEP_CLASS}>3</span>
                <Download className="hidden h-4 w-4 sm:block" />
                <span className="truncate">{i18n.tabExport}</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className={TAB_TRIGGER_CLASS}>
                <Settings className="h-4 w-4" />
                <span className="truncate">{i18n.tabSettings}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4">
            {!hasContacts ? (
              <>
                <WelcomeGuide onLoadSample={handleLoadSample} />
                <VcfImporter onImport={handleImport} />
                <VcfExportGuide />
              </>
            ) : (
              <>
                {/* 선택이 없으면 하단 액션바가 숨겨져 다음 행동이 안 보인다.
                    체크하는 순간 사라지는 안내를 대신 띄운다. */}
                {selectedIds.size === 0 && (
                  <div className="callout callout-info animate-rise">
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold">{i18n.nextStepTitle}</p>
                      <p className="mt-0.5">{i18n.nextStepDesc}</p>
                    </div>
                  </div>
                )}
                {duplicateGroups.length > 0 && (
                  <DuplicateReview
                    groups={duplicateGroups}
                    contactsById={contactsById}
                    includeSimilarNames={includeSimilarNames}
                    onIncludeSimilarNamesChange={setIncludeSimilarNames}
                    onMerge={handleMergeDuplicates}
                    onIgnore={handleIgnoreDuplicates}
                  />
                )}
                <ContactsTable
                  contacts={state.contacts}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onContactUpdate={handleContactUpdate}
                  onContactDelete={handleContactDelete}
                />
                <BatchActionsBar
                  selectedCount={selectedIds.size}
                  prefixList={state.prefixList}
                  suffixList={state.suffixList}
                  orgPrefixList={state.orgPrefixList}
                  orgSuffixList={state.orgSuffixList}
                  existingGroups={existingGroups}
                  onApplyItem={handleApplyItem}
                  onAssignGroup={handleAssignGroup}
                  onClearSelection={() => setSelectedIds(new Set())}
                  onDeleteSelected={() => setDeleteConfirmOpen(true)}
                />
              </>
            )}

            {/* Import More */}
            {hasContacts && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{i18n.importMore}</CardTitle>
                  <CardDescription>{i18n.importDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <VcfImporter onImport={handleImport} bare />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prefix/Suffix Tab */}
          <TabsContent value="prefixsuffix" className="space-y-4">
            <GroupManager
              groups={existingGroups}
              countByGroup={countByGroup}
              removableGroups={state.groupList ?? []}
              onAdd={handleAddGroup}
              onRemove={handleRemoveGroup}
            />
            <PrefixSuffixManager
              prefixList={state.prefixList}
              suffixList={state.suffixList}
              orgPrefixList={state.orgPrefixList}
              orgSuffixList={state.orgSuffixList}
              onPrefixChange={handlePrefixChange}
              onSuffixChange={handleSuffixChange}
              onOrgPrefixChange={handleOrgPrefixChange}
              onOrgSuffixChange={handleOrgSuffixChange}
            />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  화면
                </CardTitle>
                <CardDescription>
                  포인트 색과 밝기를 골라보세요. 바로 반영됩니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSelector />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Tags className="h-4 w-4 text-muted-foreground" />
                  {i18n.settingsSeparators}
                </CardTitle>
                <CardDescription>
                  붙일 때 이름과 표기 사이에 들어가는 글자예요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="prefix-sep" className="text-sm font-medium">
                    {i18n.settingsPrefixSeparator}
                  </Label>
                  <Input
                    id="prefix-sep"
                    value={state.settings.prefixSeparator}
                    onChange={e =>
                      handleSeparatorChange("prefixSeparator", e.target.value)
                    }
                    placeholder="공백"
                    maxLength={5}
                    className="h-12 rounded-xl border-transparent bg-muted px-4"
                  />
                  <p className="text-xs text-muted-foreground">
                    예: "Dr." + " " + "John" = "Dr. John"
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="suffix-sep" className="text-sm font-medium">
                    {i18n.settingsSuffixSeparator}
                  </Label>
                  <Input
                    id="suffix-sep"
                    value={state.settings.suffixSeparator}
                    onChange={e =>
                      handleSeparatorChange("suffixSeparator", e.target.value)
                    }
                    placeholder="공백"
                    maxLength={5}
                    className="h-12 rounded-xl border-transparent bg-muted px-4"
                  />
                  <p className="text-xs text-muted-foreground">
                    예: "John" + " " + "Jr." = "John Jr."
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/60 p-4">
                  <Label
                    htmlFor="prevent-dup"
                    className="block text-sm font-medium"
                  >
                    {i18n.settingsPreventDuplicates}
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      {i18n.settingsPreventDuplicatesDesc}
                    </span>
                  </Label>
                  <Switch
                    id="prevent-dup"
                    checked={state.settings.preventDuplicates}
                    onCheckedChange={checked => {
                      updateState({
                        settings: {
                          ...state.settings,
                          preventDuplicates: checked,
                        },
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />내
                  데이터
                </CardTitle>
                <CardDescription>
                  연락처는 이 브라우저 안에만 저장되고 어디로도 전송되지 않아요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="ghost"
                  onClick={() => setConfirmOpen(true)}
                  className="press h-12 w-full justify-start rounded-xl bg-destructive/8 text-destructive hover:bg-destructive/15 hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {i18n.settingsClearAll}
                </Button>
                <p className="text-xs text-muted-foreground">
                  {i18n.settingsClearAllDesc}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{i18n.exportTitle}</CardTitle>
                <CardDescription>{i18n.exportDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-muted/60 p-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    {i18n.exportTotalContacts}
                  </p>
                  <p className="tabular mt-1 text-3xl font-bold tracking-tight">
                    {state.contacts.length}
                    <span className="ml-1 text-base font-semibold text-muted-foreground">
                      개
                    </span>
                  </p>
                </div>
                <ExportButton contacts={state.contacts} />
              </CardContent>
            </Card>
            <PhoneApplyGuide />
          </TabsContent>
        </Tabs>

        <p className="pt-10 text-center text-xs text-muted-foreground">
          연꾸 · 모든 처리는 기기 안에서만 이뤄집니다
        </p>
      </main>

      {/* Batch Preview Modal */}
      <BatchPreviewModal
        open={previewOpen}
        action={
          pendingAction === null
            ? "add"
            : pendingAction.kind === "group"
              ? "group"
              : pendingAction.mode
        }
        preview={previewItems}
        totalSelected={selectedIds.size}
        onConfirm={handleConfirmApply}
        onCancel={() => {
          setPreviewOpen(false);
          setPendingAction(null);
        }}
      />

      {/* 선택 삭제 확인 */}
      <ConfirmModal
        open={deleteConfirmOpen}
        title={i18n.confirmDeleteSelected}
        description={`${selectedIds.size}${i18n.confirmDeleteSelectedDesc}`}
        confirmText={i18n.confirmDeleteButton}
        cancelText={i18n.confirmCancel}
        isDangerous
        onConfirm={handleDeleteSelected}
        onCancel={() => setDeleteConfirmOpen(false)}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title={i18n.confirmClearAll}
        description={i18n.confirmClearAllDesc}
        confirmText={i18n.confirmClearAllButton}
        cancelText={i18n.confirmCancel}
        isDangerous
        onConfirm={handleReset}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

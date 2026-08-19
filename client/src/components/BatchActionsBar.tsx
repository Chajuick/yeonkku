import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { PrefixSuffixItem } from "@/../../shared/types";
import { i18n } from "@/lib/i18n";
import { ChevronDown, FolderInput, Minus, Plus, Trash2, X } from "lucide-react";
import { Fragment, useState } from "react";

export type BatchTargetKind = "prefix" | "suffix" | "orgPrefix" | "orgSuffix";

interface BatchActionsBarProps {
  selectedCount: number;
  prefixList: PrefixSuffixItem[];
  suffixList: PrefixSuffixItem[];
  orgPrefixList: PrefixSuffixItem[];
  orgSuffixList: PrefixSuffixItem[];
  /** 이미 쓰이고 있는 그룹(ORG) 목록 */
  existingGroups: string[];
  onApplyItem: (
    kind: BatchTargetKind,
    mode: "add" | "remove",
    item: PrefixSuffixItem
  ) => void;
  onAssignGroup: (groupName: string) => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
}

/**
 * 선택한 연락처에 실행할 동작을 고르는 하단 바.
 *
 * 예전에는 "켜 둔 항목 전부"가 한꺼번에 적용됐는데, 그러면 대상마다 켜고 끄는
 * 준비 동작이 필요했다. 지금은 체크한 뒤 무엇을 붙일지 여기서 바로 고른다.
 *
 * 화면 아래에 떠 있는 카드 형태라 폰에서 엄지로 닿는 자리에 놓인다.
 */
export default function BatchActionsBar({
  selectedCount,
  prefixList,
  suffixList,
  orgPrefixList,
  orgSuffixList,
  existingGroups,
  onApplyItem,
  onAssignGroup,
  onClearSelection,
  onDeleteSelected,
}: BatchActionsBarProps) {
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  if (selectedCount === 0) return null;

  const sections: {
    kind: BatchTargetKind;
    label: string;
    items: PrefixSuffixItem[];
  }[] = [
    { kind: "prefix", label: i18n.batchSectionNamePrefix, items: prefixList },
    { kind: "suffix", label: i18n.batchSectionNameSuffix, items: suffixList },
    {
      kind: "orgPrefix",
      label: i18n.batchSectionOrgPrefix,
      items: orgPrefixList,
    },
    {
      kind: "orgSuffix",
      label: i18n.batchSectionOrgSuffix,
      items: orgSuffixList,
    },
  ];

  const renderMenu = (mode: "add" | "remove") => (
    <DropdownMenuContent
      align="start"
      side="top"
      sideOffset={8}
      className="w-60 rounded-2xl p-1.5"
    >
      {sections.map((section, index) => (
        <Fragment key={section.kind}>
          {index > 0 && <DropdownMenuSeparator />}
          <DropdownMenuLabel className="px-2 text-xs font-semibold text-muted-foreground">
            {section.label}
          </DropdownMenuLabel>
          {section.items.length === 0 ? (
            <DropdownMenuItem disabled className="rounded-xl text-xs">
              {i18n.batchNoItems}
            </DropdownMenuItem>
          ) : section.items.filter(item => item.enabled).length === 0 ? (
            <DropdownMenuItem disabled className="rounded-xl text-xs">
              {i18n.batchAllDisabled}
            </DropdownMenuItem>
          ) : (
            section.items
              .filter(item => item.enabled)
              .map(item => (
                <DropdownMenuItem
                  key={item.id}
                  onSelect={() => onApplyItem(section.kind, mode, item)}
                  className="rounded-xl py-2 font-medium"
                >
                  {item.text}
                </DropdownMenuItem>
              ))
          )}
        </Fragment>
      ))}
    </DropdownMenuContent>
  );

  const confirmNewGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;

    onAssignGroup(name);
    setNewGroupName("");
    setNewGroupOpen(false);
  };

  return (
    <div className="safe-bottom sticky bottom-0 z-30 -mx-1 pt-3">
      <div className="animate-rise rounded-3xl border bg-popover/95 p-3 shadow-lg backdrop-blur-xl">
        {/* 선택 상태 줄 */}
        <div className="mb-2.5 flex items-center gap-2 px-1">
          <span className="text-sm font-semibold">
            <span className="tabular text-primary">{selectedCount}</span>
            {i18n.batchSelected}
          </span>

          <Button
            onClick={onDeleteSelected}
            variant="ghost"
            size="sm"
            aria-label={i18n.batchDelete}
            className="press ml-auto h-8 rounded-lg px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">{i18n.batchDelete}</span>
          </Button>
          <Button
            onClick={onClearSelection}
            variant="ghost"
            size="sm"
            aria-label={i18n.batchClearSelection}
            className="press h-8 rounded-lg px-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">{i18n.batchClearSelection}</span>
          </Button>
        </div>

        {/* 행동 줄 — 폰에서는 3등분, 넓은 화면에서는 왼쪽 정렬 */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="press h-12 gap-1 rounded-2xl px-2 text-[13px] font-bold sm:gap-2 sm:px-4 sm:text-sm">
                <Plus className="h-4 w-4" />
                <span className="truncate">{i18n.batchAttach}</span>
                <ChevronDown className="hidden h-3.5 w-3.5 opacity-70 sm:block" />
              </Button>
            </DropdownMenuTrigger>
            {renderMenu("add")}
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="press h-12 gap-1 rounded-2xl px-2 text-[13px] font-bold sm:gap-2 sm:px-4 sm:text-sm"
              >
                <Minus className="h-4 w-4" />
                <span className="truncate">{i18n.batchDetach}</span>
                <ChevronDown className="hidden h-3.5 w-3.5 opacity-70 sm:block" />
              </Button>
            </DropdownMenuTrigger>
            {renderMenu("remove")}
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="press h-12 gap-1 rounded-2xl px-2 text-[13px] font-bold sm:gap-2 sm:px-4 sm:text-sm"
              >
                <FolderInput className="h-4 w-4" />
                <span className="truncate">{i18n.batchAssignGroup}</span>
                <ChevronDown className="hidden h-3.5 w-3.5 opacity-70 sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="top"
              sideOffset={8}
              className="w-60 rounded-2xl p-1.5"
            >
              <DropdownMenuLabel className="px-2 text-xs font-semibold text-muted-foreground">
                {i18n.batchExistingGroups}
              </DropdownMenuLabel>
              {existingGroups.length === 0 ? (
                <DropdownMenuItem disabled className="rounded-xl text-xs">
                  {i18n.batchNoGroups}
                </DropdownMenuItem>
              ) : (
                existingGroups.map(group => (
                  <DropdownMenuItem
                    key={group}
                    onSelect={() => onAssignGroup(group)}
                    className="rounded-xl py-2 font-medium"
                  >
                    {group}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setNewGroupOpen(true)}
                className="rounded-xl py-2 font-medium text-primary"
              >
                {i18n.batchNewGroup}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onAssignGroup("")}
                className="rounded-xl py-2"
              >
                {i18n.batchClearGroup}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>{i18n.batchNewGroupTitle}</DialogTitle>
            <DialogDescription className="sr-only">
              새 그룹 이름을 입력하면 선택한 연락처를 그 그룹에 넣습니다.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirmNewGroup()}
            placeholder={i18n.batchNewGroupPlaceholder}
            className="h-12 rounded-xl border-transparent bg-muted px-4"
            autoFocus
          />
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              onClick={() => setNewGroupOpen(false)}
              className="press h-12 flex-1 rounded-xl font-semibold"
            >
              {i18n.previewCancel}
            </Button>
            <Button
              onClick={confirmNewGroup}
              className="press h-12 flex-1 rounded-xl font-bold"
            >
              {i18n.batchNewGroupConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

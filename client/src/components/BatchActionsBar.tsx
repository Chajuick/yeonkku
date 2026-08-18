import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import { ChevronDown, Trash2, X, Zap } from "lucide-react";
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
    <DropdownMenuContent align="start" className="w-56">
      {sections.map((section, index) => (
        <Fragment key={section.kind}>
          {index > 0 && <DropdownMenuSeparator />}
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {section.label}
          </DropdownMenuLabel>
          {section.items.length === 0 ? (
            <DropdownMenuItem disabled>{i18n.batchNoItems}</DropdownMenuItem>
          ) : section.items.filter(item => item.enabled).length === 0 ? (
            <DropdownMenuItem disabled>
              {i18n.batchAllDisabled}
            </DropdownMenuItem>
          ) : (
            section.items
              .filter(item => item.enabled)
              .map(item => (
                <DropdownMenuItem
                  key={item.id}
                  onSelect={() => onApplyItem(section.kind, mode, item)}
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
    <Card className="sticky bottom-0 z-10 border-t-2">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="font-medium">
              {selectedCount}
              {i18n.batchSelected}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                {i18n.batchAttach}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {renderMenu("add")}
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                {i18n.batchDetach}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {renderMenu("remove")}
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                {i18n.batchAssignGroup}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {i18n.batchExistingGroups}
              </DropdownMenuLabel>
              {existingGroups.length === 0 ? (
                <DropdownMenuItem disabled>
                  {i18n.batchNoGroups}
                </DropdownMenuItem>
              ) : (
                existingGroups.map(group => (
                  <DropdownMenuItem
                    key={group}
                    onSelect={() => onAssignGroup(group)}
                  >
                    {group}
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setNewGroupOpen(true)}>
                {i18n.batchNewGroup}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onAssignGroup("")}>
                {i18n.batchClearGroup}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={onClearSelection}
            variant="ghost"
            size="sm"
            className="ml-auto text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            {i18n.batchClearSelection}
          </Button>

          {/* 선택 삭제는 되돌리기 어려우니 다른 액션과 떼어 놓는다 */}
          <Button
            onClick={onDeleteSelected}
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {i18n.batchDelete}
          </Button>
        </div>
      </CardContent>

      <Dialog open={newGroupOpen} onOpenChange={setNewGroupOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{i18n.batchNewGroupTitle}</DialogTitle>
          </DialogHeader>
          <Input
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirmNewGroup()}
            placeholder={i18n.batchNewGroupPlaceholder}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewGroupOpen(false)}>
              {i18n.previewCancel}
            </Button>
            <Button onClick={confirmNewGroup}>
              {i18n.batchNewGroupConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

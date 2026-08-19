import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { i18n } from "@/lib/i18n";
import { FolderPlus, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GroupManagerProps {
  /** 미리 만들어 둔 그룹 + 연락처에서 실제로 쓰이는 그룹을 합친 목록 */
  groups: string[];
  /** 그룹별 연락처 수 */
  countByGroup: Map<string, number>;
  /** 목록에서 뺄 수 있는 그룹 (직접 만든 것만) */
  removableGroups: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

/**
 * 그룹 목록 관리.
 *
 * 연락처에 붙이기 전에 그룹을 미리 만들어 두고, 체크한 연락처를 그 그룹에
 * 넣는 흐름을 위해 목록을 따로 보관한다.
 */
export default function GroupManager({
  groups,
  countByGroup,
  removableGroups,
  onAdd,
  onRemove,
}: GroupManagerProps) {
  const [name, setName] = useState("");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (groups.includes(trimmed)) {
      toast.error(i18n.groupDuplicate);
      return;
    }

    onAdd(trimmed);
    setName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FolderPlus className="h-4 w-4 text-muted-foreground" />
          {i18n.groupTitle}
        </CardTitle>
        <CardDescription>{i18n.groupDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder={i18n.groupPlaceholder}
            className="h-12 rounded-xl border-transparent bg-muted px-4"
          />
          <Button
            onClick={submit}
            className="press h-12 shrink-0 rounded-xl px-5 font-semibold"
          >
            <Plus className="h-4 w-4" />
            {i18n.groupAdd}
          </Button>
        </div>

        {groups.length === 0 ? (
          <p className="rounded-2xl bg-muted/50 py-6 text-center text-sm text-muted-foreground">
            {i18n.groupEmpty}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {groups.map(group => {
              const count = countByGroup.get(group) ?? 0;
              const removable = removableGroups.includes(group);
              return (
                <li
                  key={group}
                  className="flex items-center gap-1.5 rounded-full bg-muted py-1.5 pl-3.5 pr-2 text-sm font-medium"
                >
                  <span className="max-w-40 truncate">{group}</span>
                  <span className="tabular text-xs text-muted-foreground">
                    {count}
                    {i18n.groupCountUnit}
                  </span>
                  {removable && (
                    <button
                      type="button"
                      onClick={() => onRemove(group)}
                      aria-label={`${group} ${i18n.groupRemove}`}
                      className="press flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-xs leading-relaxed text-muted-foreground">
          {i18n.groupRemoveHint}
        </p>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { PrefixSuffixItem } from "@/../../shared/types";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface PrefixSuffixManagerProps {
  prefixList: PrefixSuffixItem[];
  suffixList: PrefixSuffixItem[];
  orgPrefixList: PrefixSuffixItem[];
  orgSuffixList: PrefixSuffixItem[];
  onPrefixChange: (prefixes: PrefixSuffixItem[]) => void;
  onSuffixChange: (suffixes: PrefixSuffixItem[]) => void;
  onOrgPrefixChange: (prefixes: PrefixSuffixItem[]) => void;
  onOrgSuffixChange: (suffixes: PrefixSuffixItem[]) => void;
}

function makeItem(text: string, type: "prefix" | "suffix"): PrefixSuffixItem {
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    text,
    enabled: true,
    type,
  };
}

function ItemList({
  items,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  items: PrefixSuffixItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          {i18n.prefixSuffixEmpty}
        </p>
      ) : (
        items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg group"
          >
            <Checkbox
              checked={item.enabled}
              onCheckedChange={() => onToggle(item.id)}
            />
            <span
              className={`flex-1 ${item.enabled ? "" : "line-through text-muted-foreground"}`}
            >
              {item.text}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveUp(index)}
                disabled={index === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveDown(index)}
                disabled={index === items.length - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(item.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function PrefixSuffixSection({
  prefixList,
  suffixList,
  prefixPlaceholder,
  suffixPlaceholder,
  prefixTitle,
  prefixDescription,
  suffixTitle,
  suffixDescription,
  onPrefixChange,
  onSuffixChange,
}: {
  prefixList: PrefixSuffixItem[];
  suffixList: PrefixSuffixItem[];
  prefixPlaceholder: string;
  suffixPlaceholder: string;
  prefixTitle: string;
  prefixDescription: string;
  suffixTitle: string;
  suffixDescription: string;
  onPrefixChange: (items: PrefixSuffixItem[]) => void;
  onSuffixChange: (items: PrefixSuffixItem[]) => void;
}) {
  const [prefixInput, setPrefixInput] = useState("");
  const [suffixInput, setSuffixInput] = useState("");

  const addPrefix = () => {
    if (!prefixInput.trim()) {
      toast.error(i18n.prefixSuffixEmpty2);
      return;
    }
    if (prefixList.some(p => p.text === prefixInput.trim())) {
      toast.error(i18n.prefixSuffixDuplicate);
      return;
    }
    onPrefixChange([...prefixList, makeItem(prefixInput.trim(), "prefix")]);
    setPrefixInput("");
    toast.success(i18n.prefixSuffixAdded);
  };

  const addSuffix = () => {
    if (!suffixInput.trim()) {
      toast.error(i18n.prefixSuffixEmpty2);
      return;
    }
    if (suffixList.some(s => s.text === suffixInput.trim())) {
      toast.error(i18n.prefixSuffixDuplicate);
      return;
    }
    onSuffixChange([...suffixList, makeItem(suffixInput.trim(), "suffix")]);
    setSuffixInput("");
    toast.success(i18n.prefixSuffixAdded);
  };

  const move = (
    list: PrefixSuffixItem[],
    i: number,
    dir: -1 | 1,
    onChange: (items: PrefixSuffixItem[]) => void
  ) => {
    const next = i + dir;
    if (next < 0 || next >= list.length) return;
    const newList = [...list];
    [newList[i], newList[next]] = [newList[next], newList[i]];
    onChange(newList);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{prefixTitle}</CardTitle>
          <CardDescription>{prefixDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={prefixPlaceholder}
              value={prefixInput}
              onChange={e => setPrefixInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") addPrefix();
              }}
            />
            <Button onClick={addPrefix} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ItemList
            items={prefixList}
            onToggle={id =>
              onPrefixChange(
                prefixList.map(p =>
                  p.id === id ? { ...p, enabled: !p.enabled } : p
                )
              )
            }
            onDelete={id => {
              onPrefixChange(prefixList.filter(p => p.id !== id));
              toast.success(i18n.prefixSuffixDeleted);
            }}
            onMoveUp={i => move(prefixList, i, -1, onPrefixChange)}
            onMoveDown={i => move(prefixList, i, 1, onPrefixChange)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{suffixTitle}</CardTitle>
          <CardDescription>{suffixDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={suffixPlaceholder}
              value={suffixInput}
              onChange={e => setSuffixInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") addSuffix();
              }}
            />
            <Button onClick={addSuffix} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ItemList
            items={suffixList}
            onToggle={id =>
              onSuffixChange(
                suffixList.map(s =>
                  s.id === id ? { ...s, enabled: !s.enabled } : s
                )
              )
            }
            onDelete={id => {
              onSuffixChange(suffixList.filter(s => s.id !== id));
              toast.success(i18n.prefixSuffixDeleted);
            }}
            onMoveUp={i => move(suffixList, i, -1, onSuffixChange)}
            onMoveDown={i => move(suffixList, i, 1, onSuffixChange)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function PrefixSuffixManager({
  prefixList,
  suffixList,
  orgPrefixList,
  orgSuffixList,
  onPrefixChange,
  onSuffixChange,
  onOrgPrefixChange,
  onOrgSuffixChange,
}: PrefixSuffixManagerProps) {
  return (
    <Tabs defaultValue="name">
      <TabsList className="mb-4">
        <TabsTrigger value="name">{i18n.tabName}</TabsTrigger>
        <TabsTrigger value="org">{i18n.tabOrg}</TabsTrigger>
      </TabsList>

      <TabsContent value="name">
        <PrefixSuffixSection
          prefixList={prefixList}
          suffixList={suffixList}
          prefixTitle={i18n.prefixTitle}
          prefixDescription={i18n.prefixDescription}
          prefixPlaceholder={i18n.prefixPlaceholder}
          suffixTitle={i18n.suffixTitle}
          suffixDescription={i18n.suffixDescription}
          suffixPlaceholder={i18n.suffixPlaceholder}
          onPrefixChange={onPrefixChange}
          onSuffixChange={onSuffixChange}
        />
      </TabsContent>

      <TabsContent value="org">
        <PrefixSuffixSection
          prefixList={orgPrefixList}
          suffixList={orgSuffixList}
          prefixTitle={i18n.orgPrefixTitle}
          prefixDescription={i18n.orgPrefixDescription}
          prefixPlaceholder={i18n.orgPrefixPlaceholder}
          suffixTitle={i18n.orgSuffixTitle}
          suffixDescription={i18n.orgSuffixDescription}
          suffixPlaceholder={i18n.orgSuffixPlaceholder}
          onPrefixChange={onOrgPrefixChange}
          onSuffixChange={onOrgSuffixChange}
        />
      </TabsContent>
    </Tabs>
  );
}

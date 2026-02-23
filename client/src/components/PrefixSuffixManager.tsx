import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PrefixSuffixItem } from "@/../../shared/types";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface PrefixSuffixManagerProps {
  prefixList: PrefixSuffixItem[];
  suffixList: PrefixSuffixItem[];
  onPrefixChange: (prefixes: PrefixSuffixItem[]) => void;
  onSuffixChange: (suffixes: PrefixSuffixItem[]) => void;
}

/**
 * Prefix/Suffix Manager Component
 * Manage prefix and suffix items with add, edit, delete, and reorder
 */
export default function PrefixSuffixManager({
  prefixList,
  suffixList,
  onPrefixChange,
  onSuffixChange,
}: PrefixSuffixManagerProps) {
  const [prefixInput, setPrefixInput] = useState("");
  const [suffixInput, setSuffixInput] = useState("");

  // Add new prefix
  const addPrefix = () => {
    if (!prefixInput.trim()) {
      toast.error(i18n.prefixSuffixEmpty2);
      return;
    }

    // Check for duplicates
    if (prefixList.some((p) => p.text === prefixInput.trim())) {
      toast.error(i18n.prefixSuffixDuplicate);
      return;
    }

    const newPrefix: PrefixSuffixItem = {
      id: `prefix_${Date.now()}`,
      text: prefixInput.trim(),
      enabled: true,
      type: "prefix",
    };

    onPrefixChange([...prefixList, newPrefix]);
    setPrefixInput("");
    toast.success(i18n.prefixSuffixAdded);
  };

  // Add new suffix
  const addSuffix = () => {
    if (!suffixInput.trim()) {
      toast.error(i18n.prefixSuffixEmpty2);
      return;
    }

    // Check for duplicates
    if (suffixList.some((s) => s.text === suffixInput.trim())) {
      toast.error(i18n.prefixSuffixDuplicate);
      return;
    }

    const newSuffix: PrefixSuffixItem = {
      id: `suffix_${Date.now()}`,
      text: suffixInput.trim(),
      enabled: true,
      type: "suffix",
    };

    onSuffixChange([...suffixList, newSuffix]);
    setSuffixInput("");
    toast.success(i18n.prefixSuffixAdded);
  };

  // Delete prefix
  const deletePrefix = (id: string) => {
    onPrefixChange(prefixList.filter((p) => p.id !== id));
    toast.success(i18n.prefixSuffixDeleted);
  };

  // Delete suffix
  const deleteSuffix = (id: string) => {
    onSuffixChange(suffixList.filter((s) => s.id !== id));
    toast.success(i18n.prefixSuffixDeleted);
  };

  // Toggle prefix enabled
  const togglePrefix = (id: string) => {
    onPrefixChange(
      prefixList.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  // Toggle suffix enabled
  const toggleSuffix = (id: string) => {
    onSuffixChange(
      suffixList.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  // Move prefix up
  const movePrefixUp = (index: number) => {
    if (index === 0) return;
    const newList = [...prefixList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    onPrefixChange(newList);
  };

  // Move prefix down
  const movePrefixDown = (index: number) => {
    if (index === prefixList.length - 1) return;
    const newList = [...prefixList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    onPrefixChange(newList);
  };

  // Move suffix up
  const moveSuffixUp = (index: number) => {
    if (index === 0) return;
    const newList = [...suffixList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    onSuffixChange(newList);
  };

  // Move suffix down
  const moveSuffixDown = (index: number) => {
    if (index === suffixList.length - 1) return;
    const newList = [...suffixList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    onSuffixChange(newList);
  };

  const ItemList = ({
    items,
    onToggle,
    onDelete,
    onMoveUp,
    onMoveDown,
    placeholder,
  }: {
    items: PrefixSuffixItem[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">{placeholder}</p>
      ) : (
        items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg group"
          >
            <Checkbox checked={item.enabled} onCheckedChange={() => onToggle(item.id)} />
            <span className={`flex-1 ${item.enabled ? "" : "line-through text-muted-foreground"}`}>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Prefix Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{i18n.prefixTitle}</CardTitle>
          <CardDescription>{i18n.prefixDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={i18n.prefixPlaceholder}
              value={prefixInput}
              onChange={(e) => setPrefixInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addPrefix();
              }}
            />
            <Button onClick={addPrefix} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ItemList
            items={prefixList}
            onToggle={togglePrefix}
            onDelete={deletePrefix}
            onMoveUp={movePrefixUp}
            onMoveDown={movePrefixDown}
            placeholder={i18n.prefixSuffixEmpty}
          />
        </CardContent>
      </Card>

      {/* Suffix Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{i18n.suffixTitle}</CardTitle>
          <CardDescription>{i18n.suffixDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={i18n.suffixPlaceholder}
              value={suffixInput}
              onChange={(e) => setSuffixInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addSuffix();
              }}
            />
            <Button onClick={addSuffix} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <ItemList
            items={suffixList}
            onToggle={toggleSuffix}
            onDelete={deleteSuffix}
            onMoveUp={moveSuffixUp}
            onMoveDown={moveSuffixDown}
            placeholder={i18n.prefixSuffixEmpty}
          />
        </CardContent>
      </Card>
    </div>
  );
}

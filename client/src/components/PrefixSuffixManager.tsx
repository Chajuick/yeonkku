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
import { Switch } from "@/components/ui/switch";
import { PrefixSuffixItem } from "@/../../shared/types";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";
import { TAB_LIST_CLASS, TAB_TRIGGER_CLASS } from "@/lib/tabStyles";

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
  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-muted/50 py-6 text-center text-sm text-muted-foreground">
        {i18n.prefixSuffixEmpty}
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="group flex items-center gap-2 rounded-2xl bg-muted/50 py-2 pl-4 pr-2"
        >
          {/* 체크박스 대신 스위치. "쓸지 말지"라는 뜻이 더 분명하게 보인다 */}
          <Switch
            checked={item.enabled}
            onCheckedChange={() => onToggle(item.id)}
            aria-label={`${item.text} 사용`}
          />
          <span
            className={`min-w-0 flex-1 truncate text-[15px] font-medium ${
              item.enabled ? "" : "text-muted-foreground line-through"
            }`}
          >
            {item.text}
          </span>
          <div className="flex shrink-0 gap-0.5 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="위로"
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="press rounded-lg text-muted-foreground"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="아래로"
              onClick={() => onMoveDown(index)}
              disabled={index === items.length - 1}
              className="press rounded-lg text-muted-foreground"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={`${item.text} 삭제`}
              onClick={() => onDelete(item.id)}
              className="press rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** 표기 하나를 관리하는 카드 (앞에 붙일 것 / 뒤에 붙일 것) */
function ItemCard({
  title,
  description,
  placeholder,
  kind,
  items,
  onChange,
}: {
  title: string;
  description: string;
  placeholder: string;
  /** 저장되는 항목의 종류. 앞에 붙이는 것과 뒤에 붙이는 것을 구분해 둔다 */
  kind: "prefix" | "suffix";
  items: PrefixSuffixItem[];
  onChange: (items: PrefixSuffixItem[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const text = input.trim();
    if (!text) {
      toast.error(i18n.prefixSuffixEmpty2);
      return;
    }
    if (items.some(item => item.text === text)) {
      toast.error(i18n.prefixSuffixDuplicate);
      return;
    }
    onChange([...items, makeItem(text, kind)]);
    setInput("");
    toast.success(i18n.prefixSuffixAdded);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const list = [...items];
    [list[index], list[next]] = [list[next], list[index]];
    onChange(list);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") add();
            }}
            className="h-12 rounded-xl border-transparent bg-muted px-4"
          />
          <Button
            onClick={add}
            aria-label="추가"
            className="press h-12 w-12 shrink-0 rounded-xl"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <ItemList
          items={items}
          onToggle={id =>
            onChange(
              items.map(item =>
                item.id === id ? { ...item, enabled: !item.enabled } : item
              )
            )
          }
          onDelete={id => {
            onChange(items.filter(item => item.id !== id));
            toast.success(i18n.prefixSuffixDeleted);
          }}
          onMoveUp={index => move(index, -1)}
          onMoveDown={index => move(index, 1)}
        />
      </CardContent>
    </Card>
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
    <Tabs defaultValue="name" className="gap-3">
      <TabsList className={`${TAB_LIST_CLASS} grid grid-cols-2`}>
        <TabsTrigger value="name" className={TAB_TRIGGER_CLASS}>
          {i18n.tabName}
        </TabsTrigger>
        <TabsTrigger value="org" className={TAB_TRIGGER_CLASS}>
          {i18n.tabOrg}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="name"
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
      >
        <ItemCard
          title={i18n.prefixTitle}
          kind="prefix"
          description={i18n.prefixDescription}
          placeholder={i18n.prefixPlaceholder}
          items={prefixList}
          onChange={onPrefixChange}
        />
        <ItemCard
          title={i18n.suffixTitle}
          kind="suffix"
          description={i18n.suffixDescription}
          placeholder={i18n.suffixPlaceholder}
          items={suffixList}
          onChange={onSuffixChange}
        />
      </TabsContent>

      <TabsContent
        value="org"
        className="grid grid-cols-1 gap-3 md:grid-cols-2"
      >
        <ItemCard
          title={i18n.orgPrefixTitle}
          kind="prefix"
          description={i18n.orgPrefixDescription}
          placeholder={i18n.orgPrefixPlaceholder}
          items={orgPrefixList}
          onChange={onOrgPrefixChange}
        />
        <ItemCard
          title={i18n.orgSuffixTitle}
          kind="suffix"
          description={i18n.orgSuffixDescription}
          placeholder={i18n.orgSuffixPlaceholder}
          items={orgSuffixList}
          onChange={onOrgSuffixChange}
        />
      </TabsContent>
    </Tabs>
  );
}

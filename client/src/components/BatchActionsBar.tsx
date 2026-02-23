import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PrefixSuffixItem } from "@/../../shared/types";
import { Zap } from "lucide-react";
import { i18n } from "@/lib/i18n";

interface BatchActionsBarProps {
  selectedCount: number;
  prefixList: PrefixSuffixItem[];
  suffixList: PrefixSuffixItem[];
  orgPrefixList: PrefixSuffixItem[];
  orgSuffixList: PrefixSuffixItem[];
  onApplyAdd: () => void;
  onApplyRemove: () => void;
  onPrefixToggle: (id: string) => void;
  onSuffixToggle: (id: string) => void;
  onOrgPrefixToggle: (id: string) => void;
  onOrgSuffixToggle: (id: string) => void;
}

export default function BatchActionsBar({
  selectedCount,
  prefixList,
  suffixList,
  orgPrefixList,
  orgSuffixList,
  onApplyAdd,
  onApplyRemove,
  onPrefixToggle,
  onSuffixToggle,
  onOrgPrefixToggle,
  onOrgSuffixToggle,
}: BatchActionsBarProps) {
  const hasEnabledItems =
    prefixList.some((p) => p.enabled) ||
    suffixList.some((s) => s.enabled) ||
    orgPrefixList.some((p) => p.enabled) ||
    orgSuffixList.some((s) => s.enabled);

  if (selectedCount === 0) return null;

  return (
    <Card className="sticky bottom-0 z-10 border-t-2">
      <CardContent className="py-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="font-medium">
                {selectedCount}{i18n.batchSelected}
              </span>
            </div>

            {/* 이름 Prefixes — 전체 표시, 클릭으로 토글 */}
            {prefixList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{i18n.batchPrefixes}</span>
                {prefixList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onPrefixToggle(p.id)}
                    className={`px-2 py-1 rounded text-sm transition-opacity ${
                      p.enabled
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 hover:opacity-75"
                        : "bg-muted text-muted-foreground line-through hover:opacity-75"
                    }`}
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            )}

            {/* 이름 Suffixes — 전체 표시 */}
            {suffixList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{i18n.batchSuffixes}</span>
                {suffixList.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSuffixToggle(s.id)}
                    className={`px-2 py-1 rounded text-sm transition-opacity ${
                      s.enabled
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 hover:opacity-75"
                        : "bg-muted text-muted-foreground line-through hover:opacity-75"
                    }`}
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            )}

            {/* 회사 Prefixes — 전체 표시 */}
            {orgPrefixList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{i18n.batchOrgPrefixes}</span>
                {orgPrefixList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onOrgPrefixToggle(p.id)}
                    className={`px-2 py-1 rounded text-sm transition-opacity ${
                      p.enabled
                        ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 hover:opacity-75"
                        : "bg-muted text-muted-foreground line-through hover:opacity-75"
                    }`}
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            )}

            {/* 회사 Suffixes — 전체 표시 */}
            {orgSuffixList.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{i18n.batchOrgSuffixes}</span>
                {orgSuffixList.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onOrgSuffixToggle(s.id)}
                    className={`px-2 py-1 rounded text-sm transition-opacity ${
                      s.enabled
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 hover:opacity-75"
                        : "bg-muted text-muted-foreground line-through hover:opacity-75"
                    }`}
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button onClick={onApplyAdd} disabled={!hasEnabledItems} variant="default" size="sm">
              {i18n.batchApply}
            </Button>
            <Button onClick={onApplyRemove} disabled={!hasEnabledItems} variant="outline" size="sm">
              {i18n.batchRemove}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

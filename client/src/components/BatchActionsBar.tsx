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
  onApplyAdd: () => void;
  onApplyRemove: () => void;
  onPrefixToggle: (id: string) => void;
  onSuffixToggle: (id: string) => void;
}

/**
 * Batch Actions Bar Component
 * Shows selected prefixes/suffixes and apply buttons
 */
export default function BatchActionsBar({
  selectedCount,
  prefixList,
  suffixList,
  onApplyAdd,
  onApplyRemove,
  onPrefixToggle,
  onSuffixToggle,
}: BatchActionsBarProps) {
  const enabledPrefixes = prefixList.filter((p) => p.enabled);
  const enabledSuffixes = suffixList.filter((s) => s.enabled);
  const hasEnabledItems = enabledPrefixes.length > 0 || enabledSuffixes.length > 0;

  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="sticky bottom-0 z-10 border-t-2">
      <CardContent className="py-4">
        <div className="space-y-4">
          {/* Selected Items Summary */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="font-medium">
                {selectedCount}
                {i18n.batchSelected}
              </span>
            </div>

            {/* Selected Prefixes */}
            {enabledPrefixes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{i18n.batchPrefixes}</span>
                {enabledPrefixes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onPrefixToggle(p.id)}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-sm hover:opacity-75 transition-opacity"
                  >
                    {p.text} ✕
                  </button>
                ))}
              </div>
            )}

            {/* Selected Suffixes */}
            {enabledSuffixes.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{i18n.batchSuffixes}</span>
                {enabledSuffixes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onSuffixToggle(s.id)}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-sm hover:opacity-75 transition-opacity"
                  >
                    {s.text} ✕
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={onApplyAdd}
              disabled={!hasEnabledItems}
              variant="default"
              size="sm"
            >
              {i18n.batchApply}
            </Button>
            <Button
              onClick={onApplyRemove}
              disabled={!hasEnabledItems}
              variant="outline"
              size="sm"
            >
              {i18n.batchRemove}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

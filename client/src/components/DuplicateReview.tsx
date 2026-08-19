import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Contact } from "@/../../shared/types";
import { DuplicateGroup, DuplicateReason, isWeakGroup } from "@/lib/duplicates";
import { i18n } from "@/lib/i18n";
import { Check, ChevronDown, CopyCheck, Merge } from "lucide-react";
import { useState } from "react";

interface DuplicateReviewProps {
  groups: DuplicateGroup[];
  contactsById: Map<string, Contact>;
  includeSimilarNames: boolean;
  onIncludeSimilarNamesChange: (value: boolean) => void;
  onMerge: (group: DuplicateGroup, primaryId: string) => void;
  onIgnore: (group: DuplicateGroup) => void;
}

const REASON_LABELS: Record<DuplicateReason, string> = {
  tel: i18n.dupReasonTel,
  email: i18n.dupReasonEmail,
  name: i18n.dupReasonName,
  nameSimilar: i18n.dupReasonNameSimilar,
};

/**
 * 중복 의심 연락처 검토 카드.
 * 자동으로 지우지 않고, 어떤 근거로 묶였는지 보여준 뒤 사용자가 고르게 한다.
 */
export default function DuplicateReview({
  groups,
  contactsById,
  includeSimilarNames,
  onIncludeSimilarNamesChange,
  onMerge,
  onIgnore,
}: DuplicateReviewProps) {
  const [open, setOpen] = useState(false);
  const [primaryByGroup, setPrimaryByGroup] = useState<Record<string, string>>(
    {}
  );

  return (
    <Card className="gap-0 overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning">
                  <CopyCheck className="h-4 w-4 text-warning-foreground" />
                </span>
                {i18n.dupTitle}
              </CardTitle>
              <CardDescription className="tabular mt-1">
                {groups.length}
                {i18n.dupGroupCount}
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="press h-10 shrink-0 rounded-xl px-4 font-semibold"
              >
                {open ? i18n.dupCollapse : i18n.dupExpand}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted/60 p-4">
              <Label
                htmlFor="include-similar-names"
                className="block text-sm font-medium"
              >
                {i18n.dupIncludeSimilar}
                <span className="mt-0.5 block text-xs font-normal leading-relaxed text-muted-foreground">
                  {i18n.dupIncludeSimilarDesc}
                </span>
              </Label>
              <Switch
                id="include-similar-names"
                checked={includeSimilarNames}
                onCheckedChange={onIncludeSimilarNamesChange}
              />
            </div>

            {groups.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {i18n.dupEmpty}
              </p>
            )}

            {groups.map(group => {
              const members = group.contactIds
                .map(id => contactsById.get(id))
                .filter((c): c is Contact => Boolean(c));
              const primaryId = primaryByGroup[group.key] ?? members[0]?.id;

              return (
                <div
                  key={group.key}
                  className="space-y-3 rounded-2xl border p-4"
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    {group.reasons.map(reason => (
                      <span
                        key={reason}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          reason === "nameSimilar"
                            ? "border border-border text-muted-foreground"
                            : "bg-brand-tint text-primary"
                        }`}
                      >
                        {REASON_LABELS[reason]}
                        {reason === "nameSimilar" &&
                          group.nameFragments.length > 0 &&
                          ` · "${group.nameFragments.join('", "')}"`}
                      </span>
                    ))}
                    {isWeakGroup(group) && (
                      <span className="text-xs text-muted-foreground">
                        {i18n.dupWeakHint}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {members.map(contact => {
                      const isPrimary = contact.id === primaryId;
                      return (
                        <label
                          key={contact.id}
                          className={`press flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                            isPrimary
                              ? "border-primary/40 bg-brand-tint"
                              : "border-transparent bg-muted/40"
                          }`}
                        >
                          {/* 라디오 대신 체크 원. 어느 쪽을 남기는지가 한눈에 보인다 */}
                          <input
                            type="radio"
                            name={`primary-${group.key}`}
                            checked={isPrimary}
                            onChange={() =>
                              setPrimaryByGroup(prev => ({
                                ...prev,
                                [group.key]: contact.id,
                              }))
                            }
                            className="sr-only"
                          />
                          <span
                            aria-hidden
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              isPrimary
                                ? "border-primary bg-primary"
                                : "border-input"
                            }`}
                          >
                            {isPrimary && (
                              <Check
                                className="h-3 w-3 text-primary-foreground"
                                strokeWidth={3}
                              />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[15px] font-semibold">
                              {contact.fn}
                            </span>
                            <span className="break-anywhere block truncate text-xs text-muted-foreground">
                              {[
                                contact.org,
                                ...(contact.tel ?? []),
                                ...(contact.email ?? []),
                              ]
                                .filter(Boolean)
                                .join(" · ") || i18n.dupNoDetail}
                            </span>
                          </span>
                          {isPrimary && (
                            <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                              {i18n.dupPrimary}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onMerge(group, primaryId)}
                      className="press h-11 flex-1 rounded-xl font-bold"
                    >
                      <Merge className="h-4 w-4" />
                      {i18n.dupMerge}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => onIgnore(group)}
                      className="press h-11 rounded-xl px-4 font-semibold text-muted-foreground"
                    >
                      {i18n.dupIgnore}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

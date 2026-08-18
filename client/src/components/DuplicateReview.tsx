import { Badge } from "@/components/ui/badge";
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
import { ChevronDown, CopyCheck, Merge } from "lucide-react";
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
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CopyCheck className="h-5 w-5" />
                {i18n.dupTitle}
              </CardTitle>
              <CardDescription>
                {groups.length}
                {i18n.dupGroupCount}
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl">
                {open ? i18n.dupCollapse : i18n.dupExpand}
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/40 p-3">
              <Label
                htmlFor="include-similar-names"
                className="font-body text-sm leading-relaxed"
              >
                {i18n.dupIncludeSimilar}
                <span className="block text-xs text-muted-foreground">
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
              <p className="py-4 text-center font-body text-sm text-muted-foreground">
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
                  <div className="flex flex-wrap items-center gap-2">
                    {group.reasons.map(reason => (
                      <Badge
                        key={reason}
                        variant={
                          reason === "nameSimilar" ? "outline" : "secondary"
                        }
                        className="rounded-full"
                      >
                        {REASON_LABELS[reason]}
                        {reason === "nameSimilar" &&
                          group.nameFragments.length > 0 &&
                          ` · "${group.nameFragments.join('", "')}"`}
                      </Badge>
                    ))}
                    {isWeakGroup(group) && (
                      <span className="text-xs text-muted-foreground">
                        {i18n.dupWeakHint}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {members.map(contact => (
                      <label
                        key={contact.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                          contact.id === primaryId
                            ? "border-primary bg-primary/5"
                            : "border-transparent bg-muted/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`primary-${group.key}`}
                          checked={contact.id === primaryId}
                          onChange={() =>
                            setPrimaryByGroup(prev => ({
                              ...prev,
                              [group.key]: contact.id,
                            }))
                          }
                          className="mt-1 accent-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{contact.fn}</p>
                          <p className="truncate font-body text-xs text-muted-foreground">
                            {[
                              contact.org,
                              ...(contact.tel ?? []),
                              ...(contact.email ?? []),
                            ]
                              .filter(Boolean)
                              .join(" · ") || i18n.dupNoDetail}
                          </p>
                        </div>
                        {contact.id === primaryId && (
                          <Badge variant="secondary" className="rounded-full">
                            {i18n.dupPrimary}
                          </Badge>
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="rounded-xl"
                      onClick={() => onMerge(group, primaryId)}
                    >
                      <Merge className="mr-1 h-4 w-4" />
                      {i18n.dupMerge}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() => onIgnore(group)}
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

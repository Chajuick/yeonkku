import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { i18n } from "@/lib/i18n";

interface PreviewItem {
  id: string;
  before: string;
  after: string;
  orgBefore?: string;
  orgAfter?: string;
}

interface BatchPreviewModalProps {
  open: boolean;
  action: "add" | "remove" | "group";
  preview: PreviewItem[];
  totalSelected: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const MAX_PREVIEW_ROWS = 10;

/** 한 줄짜리 before → after 표시 */
function DiffRow({
  label,
  before,
  after,
  changed,
}: {
  label: string;
  before?: string;
  after?: string;
  changed: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-8 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-muted-foreground">
        {before || "—"}
      </span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
      <span
        className={`min-w-0 flex-1 truncate ${
          changed ? "font-semibold text-primary" : "text-muted-foreground"
        }`}
      >
        {changed ? after || "—" : i18n.previewNoChange}
      </span>
    </div>
  );
}

export default function BatchPreviewModal({
  open,
  action,
  preview,
  totalSelected,
  onConfirm,
  onCancel,
}: BatchPreviewModalProps) {
  const isItemChanged = (p: PreviewItem) =>
    p.before !== p.after ||
    (p.orgBefore !== p.orgAfter &&
      (p.orgBefore !== undefined || p.orgAfter !== undefined));
  const changed = preview.filter(isItemChanged);
  const unchanged = preview.length - changed.length;
  const displayed = preview.slice(0, MAX_PREVIEW_ROWS);
  const remaining = totalSelected - displayed.length;

  const actionLabel =
    action === "group"
      ? i18n.previewAssignGroup
      : action === "add"
        ? i18n.previewAdd
        : i18n.previewRemove;

  return (
    <Dialog open={open} onOpenChange={open => !open && onCancel()}>
      <DialogContent className="max-w-xl gap-4 rounded-3xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold">
            {i18n.previewTitle}
          </DialogTitle>
          <DialogDescription className="sr-only">
            선택한 연락처가 어떻게 바뀌는지 미리 보고 확정합니다.
          </DialogDescription>
          <div className="flex flex-wrap gap-1.5">
            <span className="tabular rounded-full bg-brand-tint px-2.5 py-1 text-xs font-semibold text-primary">
              바뀜 {changed.length}개
            </span>
            {unchanged > 0 && (
              <span className="tabular rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                변경 없음 {unchanged}개
              </span>
            )}
            <span className="tabular rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              선택 {totalSelected}개
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[45vh]">
          <ul className="space-y-1.5 pr-2">
            {displayed.map(item => {
              const fnChanged = item.before !== item.after;
              const orgChanged =
                item.orgBefore !== item.orgAfter &&
                (item.orgBefore !== undefined || item.orgAfter !== undefined);

              return (
                <li
                  key={item.id}
                  className={`space-y-1 rounded-2xl p-3 ${
                    fnChanged || orgChanged ? "bg-muted/60" : "bg-muted/25"
                  }`}
                >
                  <DiffRow
                    label="이름"
                    before={item.before}
                    after={item.after}
                    changed={fnChanged}
                  />
                  {orgChanged && (
                    <DiffRow
                      label="그룹"
                      before={item.orgBefore}
                      after={item.orgAfter}
                      changed
                    />
                  )}
                </li>
              );
            })}
          </ul>
          {remaining > 0 && (
            <p className="tabular pt-2.5 text-center text-xs text-muted-foreground">
              외 {remaining}개 더
            </p>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="press h-13 flex-1 rounded-2xl text-base font-semibold"
          >
            {i18n.previewCancel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={changed.length === 0}
            className="press h-13 flex-1 rounded-2xl text-base font-bold"
          >
            {changed.length}개 {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

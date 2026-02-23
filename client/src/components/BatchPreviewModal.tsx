import {
  Dialog,
  DialogContent,
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
  action: "add" | "remove";
  preview: PreviewItem[];
  totalSelected: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const MAX_PREVIEW_ROWS = 10;

export default function BatchPreviewModal({
  open,
  action,
  preview,
  totalSelected,
  onConfirm,
  onCancel,
}: BatchPreviewModalProps) {
  const isItemChanged = (p: PreviewItem) =>
    p.before !== p.after || (p.orgBefore !== p.orgAfter && (p.orgBefore !== undefined || p.orgAfter !== undefined));
  const changed = preview.filter(isItemChanged);
  const unchanged = preview.length - changed.length;
  const displayed = preview.slice(0, MAX_PREVIEW_ROWS);
  const remaining = totalSelected - displayed.length;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{i18n.previewTitle}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {totalSelected}개 선택 · 변경되는 연락처 {changed.length}개
            {unchanged > 0 && ` · 변경 없음 ${unchanged}개`}
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-72">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="pb-2 text-left font-medium w-8"></th>
                <th className="pb-2 text-left font-medium">변경 전</th>
                <th className="pb-2 px-2 w-6" />
                <th className="pb-2 text-left font-medium">변경 후</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((item) => {
                const fnChanged = item.before !== item.after;
                const orgChanged = item.orgBefore !== item.orgAfter &&
                  (item.orgBefore !== undefined || item.orgAfter !== undefined);
                const anyChanged = fnChanged || orgChanged;
                return (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-2 pr-1 text-xs text-muted-foreground align-top pt-3">이름</td>
                    <td className="py-1 pr-2 max-w-[160px]">
                      <div className="truncate">{item.before}</div>
                      {orgChanged && (
                        <div className="truncate text-muted-foreground mt-1">
                          <span className="text-xs mr-1">회사</span>{item.orgBefore || "—"}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2 text-muted-foreground align-top pt-3">
                      {anyChanged ? <ArrowRight className="w-3 h-3" /> : <span>—</span>}
                    </td>
                    <td className="py-1 max-w-[160px]">
                      <div className={`truncate ${fnChanged ? "font-medium text-primary" : "text-muted-foreground"}`}>
                        {fnChanged ? item.after : i18n.previewNoChange}
                      </div>
                      {orgChanged && (
                        <div className="truncate mt-1 font-medium text-primary">
                          <span className="text-xs mr-1 font-normal text-muted-foreground">회사</span>
                          {item.orgAfter || "—"}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {remaining > 0 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              외 {remaining}개 더...
            </p>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {i18n.previewCancel}
          </Button>
          <Button onClick={onConfirm} disabled={changed.length === 0}>
            {action === "add" ? i18n.previewAdd : i18n.previewRemove} ({changed.length}개)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

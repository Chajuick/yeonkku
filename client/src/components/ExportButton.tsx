import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Contact } from "@/../../shared/types";
import { Download, FileText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { contactsToVCardFile, generateExportFilename } from "@/lib/vcardParser";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface ExportButtonProps {
  contacts: Contact[];
  disabled?: boolean;
}

const PREVIEW_LENGTH = 500;

/**
 * Export Button Component
 * Shows preview modal and downloads .vcf file
 */
export default function ExportButton({
  contacts,
  disabled = false,
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    if (contacts.length === 0) {
      toast.error(i18n.exportNoContacts);
      return;
    }

    try {
      const vcardContent = contactsToVCardFile(contacts);
      const blob = new Blob([vcardContent], {
        type: "text/vcard;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = generateExportFilename();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${contacts.length}${i18n.exportSuccess}`);
      setOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(i18n.exportError);
    }
  };

  // 미리보기 때문에 전체 파일을 두 번 만들 필요는 없다
  const fullContent = open ? contactsToVCardFile(contacts) : "";
  const previewContent = fullContent.substring(0, PREVIEW_LENGTH);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled || contacts.length === 0}
          className="press h-14 w-full rounded-2xl text-base font-bold"
        >
          <Download className="h-4 w-4" />
          {i18n.exportAsVcf}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl gap-4 rounded-3xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-xl font-bold">
            {i18n.exportModalTitle}
          </DialogTitle>
          <DialogDescription>{i18n.exportModalDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="callout callout-info">
            <FileText className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="tabular font-semibold">
                {i18n.exportExporting}
                {contacts.length}개
              </p>
              <p>{i18n.exportFormat}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">
              {i18n.exportPreview}
            </p>
            <pre className="max-h-56 overflow-auto rounded-2xl bg-muted p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
              {previewContent}
              {fullContent.length > PREVIEW_LENGTH && "..."}
            </pre>
          </div>

          <div className="callout callout-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p>파일은 이 브라우저에서 만들어져 바로 내려받습니다.</p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            className="press h-13 flex-1 rounded-2xl text-base font-semibold"
          >
            {i18n.exportCancel}
          </Button>
          <Button
            onClick={handleExport}
            className="press h-13 flex-1 rounded-2xl text-base font-bold"
          >
            <Download className="h-4 w-4" />
            {i18n.exportDownload}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Contact } from "@/../../shared/types";
import { Download, AlertCircle } from "lucide-react";
import { useState } from "react";
import { contactsToVCardFile, generateExportFilename } from "@/lib/vcardParser";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface ExportButtonProps {
  contacts: Contact[];
  disabled?: boolean;
}

/**
 * Export Button Component
 * Shows preview modal and downloads .vcf file
 */
export default function ExportButton({ contacts, disabled = false }: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  const handleExport = () => {
    if (contacts.length === 0) {
      toast.error(i18n.exportNoContacts);
      return;
    }

    try {
      const vcardContent = contactsToVCardFile(contacts);
      const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
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

  const previewContent = contactsToVCardFile(contacts).substring(0, 500);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled || contacts.length === 0} size="lg">
          <Download className="w-4 h-4 mr-2" />
          {i18n.exportAsVcf}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{i18n.exportModalTitle}</DialogTitle>
          <DialogDescription>{i18n.exportModalDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium">
                {i18n.exportExporting}
                {contacts.length}
                개
              </p>
              <p>{i18n.exportFormat}</p>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-sm font-medium">{i18n.exportPreview}</label>
            <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto max-h-64 whitespace-pre-wrap break-words">
              {previewContent}
              {contactsToVCardFile(contacts).length > 500 && "..."}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {i18n.exportCancel}
            </Button>
            <Button onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              {i18n.exportDownload}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseVCardText } from "@/lib/vcardParser";
import { Contact } from "@/../../shared/types";
import { Upload, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface VcfImporterProps {
  onImport: (contacts: Contact[]) => void;
}

/**
 * VCF File Importer Component
 * Supports drag & drop and file selection
 */
export default function VcfImporter({ onImport }: VcfImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".vcf")) {
      toast.error(".vcf 파일을 선택해주세요");
      return;
    }

    try {
      const text = await file.text();
      const contacts = parseVCardText(text);

      if (contacts.length === 0) {
        toast.error("파일에서 유효한 연락처를 찾을 수 없습니다");
        return;
      }

      onImport(contacts);
      toast.success(`${contacts.length}개 연락처를 가져왔습니다`);
    } catch (error) {
      console.error("Failed to parse VCF:", error);
      toast.error("VCF 파일 파싱 실패");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          {i18n.importTitle}
        </CardTitle>
        <CardDescription>{i18n.importDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="font-medium">{i18n.importDragDrop}</p>
              <p className="text-sm text-muted-foreground">{i18n.importOrClick}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              {i18n.importSelectFile}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".vcf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium">{i18n.importSupportsVersions}</p>
            <p>{i18n.importDataLocal}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

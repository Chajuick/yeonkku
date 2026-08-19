import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { decodeVcfBytes } from "@/lib/encoding";
import { parseVCardText } from "@/lib/vcardParser";
import { Contact } from "@/../../shared/types";
import { Upload, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { i18n } from "@/lib/i18n";

interface VcfImporterProps {
  onImport: (contacts: Contact[]) => void;
  /** 이미 카드 안에 들어가 있을 때는 카드 껍데기를 한 번 더 두르지 않는다 */
  bare?: boolean;
}

/**
 * VCF File Importer Component
 * Supports drag & drop and file selection
 */
export default function VcfImporter({ onImport, bare }: VcfImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    // 안드로이드는 CONTACTS.VCF처럼 대문자로 내보내는 경우가 많다
    if (!/\.(vcf|vcard)$/i.test(file.name)) {
      toast.error(".vcf 파일을 선택해주세요");
      return;
    }

    try {
      // File.text()는 항상 UTF-8로 읽어서 CP949(EUC-KR) 파일이 깨진다.
      // 바이트로 읽어 인코딩을 판별한 뒤 디코딩한다.
      const { text } = decodeVcfBytes(await file.arrayBuffer());
      const contacts = parseVCardText(text);

      if (contacts.length === 0) {
        toast.error("파일에서 유효한 연락처를 찾을 수 없습니다");
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

  const dropzone = (
    <>
      {/* 상자 전체가 버튼이다. 폰에서는 드래그를 못 하니 어디를 눌러도 열리게 */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`press flex w-full flex-col items-center gap-4 rounded-2xl border-2 border-dashed px-6 py-10 text-center ${
          isDragging
            ? "border-primary bg-primary/8"
            : "border-input bg-muted/40 hover:border-primary/50 hover:bg-muted/70"
        }`}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-xs">
          <Upload className="h-6 w-6 text-primary" />
        </span>
        <span className="block">
          <span className="block text-base font-semibold">
            {i18n.importDragDrop}
          </span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {i18n.importOrClick}
          </span>
        </span>
        <Button
          asChild
          size="lg"
          className="press pointer-events-none h-11 rounded-xl px-6 font-semibold"
        >
          <span>{i18n.importSelectFile}</span>
        </Button>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".vcf,.vcard,text/vcard,text/x-vcard"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="callout callout-muted mt-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          {i18n.importDataLocal}
          <span className="mt-0.5 block">{i18n.importSupportsVersions}</span>
        </p>
      </div>
    </>
  );

  if (bare) return <div>{dropzone}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="h-4 w-4 text-muted-foreground" />
          {i18n.importTitle}
        </CardTitle>
        <CardDescription>{i18n.importDescription}</CardDescription>
      </CardHeader>
      <CardContent>{dropzone}</CardContent>
    </Card>
  );
}

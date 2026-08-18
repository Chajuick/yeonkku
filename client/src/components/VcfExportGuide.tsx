import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { i18n } from "@/lib/i18n";
import { TAB_TRIGGER_CLASS } from "@/lib/tabStyles";
import { Info, Send, Smartphone } from "lucide-react";

/**
 * 폰에서 .vcf 파일을 꺼내는 방법 안내.
 *
 * 첫 사용자가 가장 많이 막히는 지점이라 접어두지 않고 업로드 상자 바로 위에
 * 펼친 상태로 둔다.
 */
export default function VcfExportGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          {i18n.vcfGuideTitle}
        </CardTitle>
        <CardDescription>{i18n.vcfGuideDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue={i18n.vcfGuidePlatforms[0].id} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1">
            {i18n.vcfGuidePlatforms.map(platform => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                className={`${TAB_TRIGGER_CLASS} justify-center text-xs sm:text-sm`}
              >
                {platform.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {i18n.vcfGuidePlatforms.map(platform => (
            <TabsContent
              key={platform.id}
              value={platform.id}
              className="space-y-3"
            >
              <ol className="space-y-3">
                {platform.steps.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    <span className="font-body text-sm leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="flex gap-2 rounded-2xl bg-muted/50 p-3">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="font-body text-xs leading-relaxed text-muted-foreground">
                  {platform.tip}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* 폰에서 만든 파일을 PC로 옮기는 방법 */}
        <div className="space-y-2 rounded-2xl border border-dashed p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Send className="h-4 w-4" />
            {i18n.vcfGuideMoveTitle}
          </p>
          <ul className="space-y-1">
            {i18n.vcfGuideMoveSteps.map(step => (
              <li
                key={step}
                className="font-body text-sm leading-relaxed text-muted-foreground"
              >
                · {step}
              </li>
            ))}
          </ul>
          <p className="font-body text-xs text-muted-foreground">
            {i18n.vcfGuideMobileHint}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">{i18n.vcfGuideNote}</p>
      </CardContent>
    </Card>
  );
}

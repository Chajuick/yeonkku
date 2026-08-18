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
import { AlertTriangle, Info, Send, Smartphone } from "lucide-react";

/**
 * 내보낸 .vcf를 폰 연락처에 되돌리는 안내.
 *
 * 가져오기 안내(VcfExportGuide)와 짝을 이룬다. 특히 "덮어쓰기가 아니라 추가"라는
 * 점을 모르면 연락처가 두 배로 늘어나므로 경고를 눈에 띄게 둔다.
 */
export default function PhoneApplyGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          {i18n.applyGuideTitle}
        </CardTitle>
        <CardDescription>{i18n.applyGuideDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 파일을 폰으로 옮기는 방법 */}
        <div className="space-y-2 rounded-2xl border border-dashed p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Send className="h-4 w-4" />
            {i18n.applyGuideMoveTitle}
          </p>
          <ul className="space-y-1">
            {i18n.applyGuideMoveSteps.map(step => (
              <li
                key={step}
                className="font-body text-sm leading-relaxed text-muted-foreground"
              >
                · {step}
              </li>
            ))}
          </ul>
        </div>

        <Tabs
          defaultValue={i18n.applyGuidePlatforms[0].id}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1">
            {i18n.applyGuidePlatforms.map(platform => (
              <TabsTrigger
                key={platform.id}
                value={platform.id}
                className={`${TAB_TRIGGER_CLASS} justify-center text-xs sm:text-sm`}
              >
                {platform.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {i18n.applyGuidePlatforms.map(platform => (
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

        {/* 중복 경고 */}
        <div className="space-y-2 rounded-2xl border border-amber-300/60 bg-amber-50/60 p-4 dark:border-amber-800/60 dark:bg-amber-950/30">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4" />
            {i18n.applyGuideWarningTitle}
          </p>
          <p className="font-body text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            {i18n.applyGuideWarning}
          </p>
          <ul className="space-y-1">
            {i18n.applyGuideWarningSteps.map(step => (
              <li
                key={step}
                className="font-body text-sm leading-relaxed text-amber-900/80 dark:text-amber-200/80"
              >
                · {step}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

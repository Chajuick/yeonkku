import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { i18n } from "@/lib/i18n";
import { ArrowRight, Download, Sparkles, Tags, Upload } from "lucide-react";

interface WelcomeGuideProps {
  onLoadSample: () => void;
}

const STEPS = [
  {
    icon: Upload,
    title: i18n.welcomeStep1Title,
    desc: i18n.welcomeStep1Desc,
  },
  {
    icon: Tags,
    title: i18n.welcomeStep2Title,
    desc: i18n.welcomeStep2Desc,
  },
  {
    icon: Download,
    title: i18n.welcomeStep3Title,
    desc: i18n.welcomeStep3Desc,
  },
];

/**
 * 연락처가 하나도 없는 첫 방문 화면.
 * "무슨 앱인지 / 무엇부터 하면 되는지"를 업로드 박스보다 먼저 보여준다.
 */
export default function WelcomeGuide({ onLoadSample }: WelcomeGuideProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-8 pt-6">
        {/* 이 앱이 무엇인지 */}
        <div className="space-y-3 text-center">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <Sparkles className="mr-1 h-3 w-3" />
            {i18n.welcomeBadge}
          </Badge>
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            {i18n.welcomeTitle}
          </h2>
          <p className="mx-auto max-w-2xl font-body text-sm leading-relaxed text-muted-foreground">
            {i18n.welcomeDescription}
          </p>
        </div>

        {/* 결과를 눈으로 먼저 */}
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 rounded-2xl border border-dashed p-4 text-center sm:max-w-xs">
            <p className="mb-2 text-xs text-muted-foreground">
              {i18n.welcomeBefore}
            </p>
            {i18n.welcomeBeforeSamples.map(name => (
              <p
                key={name}
                className="font-body text-base text-muted-foreground"
              >
                {name}
              </p>
            ))}
          </div>
          <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" />
          <div className="flex-1 rounded-2xl border border-primary/40 bg-primary/5 p-4 text-center sm:max-w-xs">
            <p className="mb-2 text-xs text-muted-foreground">
              {i18n.welcomeAfter}
            </p>
            {i18n.welcomeAfterSamples.map(name => (
              <p key={name} className="font-body text-base font-medium">
                {name}
              </p>
            ))}
          </div>
        </div>

        {/* 무엇부터 하면 되는지 */}
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border bg-card/50 p-4 text-center"
            >
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <p className="flex items-center justify-center gap-1.5 font-medium">
                <step.icon className="h-4 w-4" />
                {step.title}
              </p>
              <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 파일이 아직 없어도 지금 바로 볼 수 있게 */}
        <div className="text-center">
          <Button size="lg" className="rounded-xl" onClick={onLoadSample}>
            <Sparkles className="mr-2 h-4 w-4" />
            {i18n.welcomeTrySample}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            {i18n.welcomeTrySampleHint}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

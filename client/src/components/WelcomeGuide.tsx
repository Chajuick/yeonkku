import { Button } from "@/components/ui/button";
import { i18n } from "@/lib/i18n";
import { ArrowDown, Download, Sparkles, Tags, Upload } from "lucide-react";

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
 *
 * 카드로 감싸지 않고 화면 자체를 표지처럼 쓴다. "무슨 앱인지 → 결과가 어떻게
 * 되는지 → 무엇부터 하면 되는지" 순서로 한 번에 훑히게 배치했다.
 */
export default function WelcomeGuide({ onLoadSample }: WelcomeGuideProps) {
  return (
    <section className="animate-rise max-w-3xl space-y-10 pb-2 pt-6">
      {/* 이 앱이 무엇인지 */}
      <div className="space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3 py-1.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {i18n.welcomeBadge}
        </span>
        <h2 className="text-[28px] font-bold leading-[1.28] tracking-tight sm:text-4xl">
          {i18n.welcomeTitle}
        </h2>
        <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {i18n.welcomeDescription}
        </p>
      </div>

      {/* 결과를 눈으로 먼저. 좁은 화면은 위아래, 넓은 화면은 좌우로 놓는다 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex-1 rounded-2xl border bg-card p-5">
          <p className="text-xs font-semibold text-muted-foreground">
            {i18n.welcomeBefore}
          </p>
          <ul className="mt-3 space-y-1.5">
            {i18n.welcomeBeforeSamples.map(name => (
              <li key={name} className="text-[15px] text-muted-foreground">
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ArrowDown className="h-4 w-4 sm:-rotate-90" strokeWidth={2.5} />
          </span>
        </div>

        <div className="flex-1 rounded-2xl border border-primary/25 bg-brand-tint p-5">
          <p className="text-xs font-semibold text-primary">
            {i18n.welcomeAfter}
          </p>
          <ul className="mt-3 space-y-1.5">
            {i18n.welcomeAfterSamples.map(name => (
              <li key={name} className="text-[15px] font-semibold">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 무엇부터 하면 되는지 */}
      <ol className="space-y-1">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            {/* 번호 옆으로 세로선을 이어 순서라는 걸 드러낸다 */}
            <div className="flex flex-col items-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[13px] font-bold text-secondary-foreground">
                {index + 1}
              </span>
              {index < STEPS.length - 1 && (
                <span className="my-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="min-w-0 pb-6">
              <p className="flex items-center gap-1.5 text-[15px] font-semibold">
                <step.icon className="h-4 w-4 text-muted-foreground" />
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* 파일이 아직 없어도 지금 바로 볼 수 있게 */}
      <div className="space-y-2">
        <Button
          size="lg"
          onClick={onLoadSample}
          className="press h-14 w-full rounded-2xl text-base font-bold"
        >
          <Sparkles className="mr-1.5 h-4 w-4" />
          {i18n.welcomeTrySample}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          {i18n.welcomeTrySampleHint}
        </p>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="app-bg flex min-h-dvh w-full items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
          <Compass className="h-7 w-7 text-muted-foreground" />
        </span>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            찾는 페이지가 없어요
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            주소가 바뀌었거나 지워진 페이지일 수 있어요. 처음 화면으로 돌아가
            다시 시작해보세요.
          </p>
        </div>

        <Button
          onClick={() => setLocation("/")}
          className="press h-14 w-full rounded-2xl text-base font-bold"
        >
          처음 화면으로
        </Button>
      </div>
    </div>
  );
}

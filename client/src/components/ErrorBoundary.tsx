import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-bg flex min-h-dvh items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg space-y-6 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </span>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">
                화면을 그리다가 문제가 생겼어요
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                저장된 연락처는 그대로 남아 있어요. 새로고침하면 대부분 정상으로
                돌아옵니다.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="press inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground hover:opacity-90"
            >
              <RotateCcw className="h-4 w-4" />
              새로고침
            </button>

            {/* 원인은 접어 둔다. 평소에는 볼 일이 없고, 필요할 때만 펼친다 */}
            <details className="text-left">
              <summary className="cursor-pointer text-xs text-muted-foreground">
                오류 자세히 보기
              </summary>
              <pre className="mt-2 max-h-56 overflow-auto rounded-2xl bg-muted p-4 font-mono text-xs whitespace-break-spaces text-muted-foreground">
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

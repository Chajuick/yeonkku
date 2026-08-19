import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TooltipProvider delayDuration={200}>
          {/* 토스트는 상단 바 아래에 뜨게 offset을 준다. 하단은 일괄 작업
              바가 차지하고 있어 겹친다. */}
          <Toaster
            position="top-center"
            offset={72}
            toastOptions={{
              classNames: {
                toast: "rounded-2xl border-border shadow-lg px-4 py-3.5 gap-3",
                title: "text-sm font-semibold",
                description: "text-xs leading-relaxed",
                actionButton: "rounded-lg font-semibold",
                cancelButton: "rounded-lg font-medium",
              },
            }}
          />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

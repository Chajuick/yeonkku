import { registerSW } from "virtual:pwa-register";
import { toast } from "sonner";

/**
 * 서비스워커 등록.
 *
 * registerType이 'prompt'라서 새 버전이 배포돼도 화면이 멋대로 새로고침되지
 * 않는다. 편집 중이던 내용을 날리지 않기 위한 선택으로, 사용자가 토스트에서
 * 직접 눌렀을 때만 교체한다.
 */
export function registerPWA(): void {
  if (import.meta.env.DEV) return;

  const updateSW = registerSW({
    onNeedRefresh() {
      toast("새 버전이 준비됐어요", {
        description: "저장된 연락처는 그대로 유지됩니다.",
        duration: Infinity,
        action: {
          label: "업데이트",
          onClick: () => {
            void updateSW(true);
          },
        },
        cancel: {
          label: "나중에",
          onClick: () => undefined,
        },
      });
    },
    onOfflineReady() {
      toast.success("오프라인에서도 쓸 수 있어요", {
        description: "네트워크 없이 앱을 열 수 있습니다.",
      });
    },
  });
}

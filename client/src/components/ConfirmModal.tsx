import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 확인 모달.
 *
 * 되돌릴 수 없는 동작은 확인 버튼을 destructive 색으로 칠하고, 취소를 왼쪽에
 * 같은 크기로 둔다. 손가락이 먼저 닿는 자리에 파괴적인 버튼을 두지 않는다.
 */
export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={isOpen => !isOpen && onCancel()}>
      <AlertDialogContent className="max-w-sm gap-5 rounded-3xl">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <AlertDialogCancel className="press h-13 flex-1 rounded-2xl border-transparent bg-muted text-base font-semibold hover:bg-accent">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`press h-13 flex-1 rounded-2xl text-base font-bold ${
              isDangerous
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }`}
          >
            {confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import type {ReactNode} from "react";
import {Dialog} from "@base-ui/react/dialog";
import {cn} from "cn";
import {X} from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
}

// Bottom sheet below md, right-side panel from md. Focus trap, Esc and
// overlay close come from Base UI's Dialog.
export function Drawer({open, onClose, title, children, className, closeLabel = "Close"}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => (nextOpen ? undefined : onClose())}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Popup
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-panel bg-canvas shadow-overlay",
            "md:inset-x-auto md:inset-y-0 md:right-0 md:max-h-none md:w-[420px] md:rounded-none md:rounded-l-panel",
            className
          )}
        >
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-line-strong md:hidden" aria-hidden="true" />
          <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-3 md:pt-6">
            <Dialog.Title className="text-h3 font-bold text-text-heading">{title}</Dialog.Title>
            <Dialog.Close
              aria-label={closeLabel}
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <X className="size-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-6">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

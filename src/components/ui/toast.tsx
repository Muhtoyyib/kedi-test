import {createContext, useCallback, useContext, useRef, useState, type ReactNode} from "react";
import {cn} from "cn";

interface ToastData {
  message: string;
  action?: {label: string; onClick: () => void};
}

interface ToastApi {
  show: (toast: ToastData) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({children}: {children: ReactNode}) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((next: ToastData) => {
    setToast(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{show}}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-50 flex justify-center md:right-6 md:bottom-6 md:left-auto md:justify-end"
      >
        {toast ? (
          <div className="pointer-events-auto flex items-center gap-4 rounded-card bg-ink px-5 py-3 text-canvas shadow-overlay">
            <span className="text-sm font-medium">{toast.message}</span>
            {toast.action ? (
              <button
                type="button"
                onClick={toast.action.onClick}
                className={cn("shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-sun hover:bg-white/10")}
              >
                {toast.action.label}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

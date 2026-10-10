import {useSyncExternalStore} from "react";
import {ArrowRight, X} from "lucide-react";
import {dismiss, isDismissed, onDismissedChange} from "@/lib/announcement";
import {getSettings} from "@/lib/catalog/settings";
import type {Settings} from "@/lib/catalog/types";

// Optional one-line bar driven by Settings.announcement (sections/01).
// Prerendered visible (server snapshot = not dismissed); after hydration it
// hides if this exact text was dismissed in the last 7 days.
export function AnnouncementBar({announcement}: {announcement?: Settings["announcement"]}) {
  const ann = announcement === undefined ? getSettings().announcement : announcement;
  const text = ann?.text ?? null;
  const dismissed = useSyncExternalStore(
    onDismissedChange,
    () => (text ? isDismissed(window.localStorage, text, Date.now()) : false),
    () => false
  );

  if (!ann || dismissed) return null;

  return (
    <aside aria-label="Announcement" className="flex min-h-10 items-center justify-center gap-2 bg-ink py-2 pr-2 pl-10">
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-sun" />
      <p className="text-center text-sm font-medium text-canvas">
        {ann.href ? (
          <a href={ann.href} className="underline decoration-sun underline-offset-4">
            {ann.text} <ArrowRight className="inline size-4 align-[-0.15em]" aria-hidden="true" />
          </a>
        ) : (
          ann.text
        )}
      </p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => dismiss(window.localStorage, ann.text, Date.now())}
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-brand-muted transition-colors hover:text-canvas"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </aside>
  );
}

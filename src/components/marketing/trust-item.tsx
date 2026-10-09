import type {LucideIcon} from "lucide-react";
import {cn} from "cn";

// One trust-bar entry: icon in a brand-soft circle + short label.
export function TrustItem({icon: Icon, label, className}: {icon: LucideIcon; label: string; className?: string}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
        <Icon className="size-5 text-brand-strong" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold text-text-heading">{label}</span>
    </div>
  );
}

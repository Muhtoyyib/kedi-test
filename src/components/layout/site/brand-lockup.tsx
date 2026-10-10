import {cn} from "cn";
import {siteConfig} from "@/lib/site-config";

// Wordmark + the mandatory "Independent KEDI Distributor" subline. Until the
// client supplies an SVG wordmark, the brand name renders as styled text
// with a small sun half-disc mark.
export function BrandLockup({inverse = false, className}: {inverse?: boolean; className?: string}) {
  return (
    <a href="/" aria-label={`${siteConfig.name} home`} className={cn("flex items-center gap-2", className)}>
      <span aria-hidden="true" className="h-2.5 w-1.25 shrink-0 self-center rounded-l-full bg-sun" />
      <span className="flex flex-col leading-tight">
        <span className={cn("text-lg font-extrabold", inverse ? "text-canvas" : "text-ink")}>{siteConfig.name}</span>
        <span className={cn("text-xs font-semibold", inverse ? "text-brand-muted" : "text-brand-strong")}>
          Independent KEDI Distributor
        </span>
      </span>
    </a>
  );
}

import type {ReactNode} from "react";
import {cn} from "cn";
import {SunArc} from "./sun-arc";

interface CtaBandProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  /** "ink" is the default dark panel; "soft" is the brand-soft variant. */
  tone?: "ink" | "soft";
}

// Rounded panel with a headline and up to two action buttons.
export function CtaBand({title, description, children, className, tone = "ink"}: CtaBandProps) {
  const ink = tone === "ink";
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-panel px-6 py-12 md:px-12 md:py-16",
        ink ? "bg-ink text-canvas" : "bg-brand-soft text-ink",
        className
      )}
    >
      <SunArc size="lg" className={cn("absolute -bottom-1 right-6 md:right-12", ink ? "opacity-25" : "opacity-40")} />
      <div className="relative">
        <h2 className={cn("max-w-2xl text-h2 font-bold text-balance md:text-h2-md", ink ? "text-canvas" : "text-text-heading")}>{title}</h2>
        {description ? (
          <p className={cn("mt-4 max-w-2xl text-lead md:text-lead-md", ink ? "text-canvas/85" : "text-text-body")}>{description}</p>
        ) : null}
        {children ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
      </div>
    </div>
  );
}

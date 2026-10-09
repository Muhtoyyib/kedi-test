import type {ReactNode} from "react";
import {cn} from "cn";
import {SunArc} from "./sun-arc";

interface CtaBandProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

// Rounded ink panel with a headline and up to two action buttons.
export function CtaBand({title, description, children, className}: CtaBandProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-panel bg-ink px-6 py-12 text-canvas md:px-12 md:py-16", className)}>
      <SunArc size="lg" className="absolute -bottom-1 right-6 opacity-25 md:right-12" />
      <div className="relative">
        <h2 className="max-w-2xl text-h2 font-bold text-balance text-canvas md:text-h2-md">{title}</h2>
        {description ? <p className="mt-4 max-w-2xl text-lead text-canvas/85 md:text-lead-md">{description}</p> : null}
        {children ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div> : null}
      </div>
    </div>
  );
}

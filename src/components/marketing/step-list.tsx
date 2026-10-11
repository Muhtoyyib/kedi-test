import type {ReactNode} from "react";
import {cn} from "cn";

interface Step {
  title: string;
  description?: ReactNode;
}

interface StepListProps {
  steps: Step[];
  /** "compact" — small sun numbers, title only, horizontal on md+ (shop strip).
   *  "timeline" — sun numbers with a connecting line, 4 columns on md+ (business). */
  variant?: "default" | "compact" | "timeline";
  className?: string;
}

// Sun numbers with a connecting line on mobile, 4 columns on md+ (business
// "How it works").
function Timeline({steps, className}: {steps: Step[]; className?: string}) {
  return (
    <ol className={cn("flex flex-col gap-8 md:grid md:grid-cols-4", className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4 md:flex-col">
          {index < steps.length - 1 ? (
            <span className="absolute top-11 bottom-0 left-5.5 w-0.5 bg-line md:hidden" aria-hidden="true" />
          ) : null}
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sun text-base font-bold text-ink"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-text-heading">{step.title}</h3>
            {step.description ? <div className="mt-1 text-base text-text-body">{step.description}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function StepList({steps, variant = "default", className}: StepListProps) {
  if (variant === "timeline") return <Timeline steps={steps} className={className} />;
  if (variant === "compact") {
    return (
      <ol className={cn("flex flex-col gap-3 md:flex-row md:gap-8", className)}>
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-center gap-3">
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sun text-sm font-bold text-ink"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="text-sm font-semibold text-text-heading">{step.title}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ol className={cn("flex flex-col gap-6", className)}>
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-base font-bold text-canvas"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-text-heading">{step.title}</h3>
            <div className="mt-1 text-base text-text-body">{step.description}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

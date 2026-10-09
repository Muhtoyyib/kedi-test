import type {ReactNode} from "react";
import {cn} from "cn";

interface Step {
  title: string;
  description: ReactNode;
}

export function StepList({steps, className}: {steps: Step[]; className?: string}) {
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

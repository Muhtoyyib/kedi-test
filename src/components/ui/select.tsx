import type {ReactNode, SelectHTMLAttributes} from "react";
import {cn} from "cn";
import {ChevronDown} from "lucide-react";

export function Select({className, children, ...props}: SelectHTMLAttributes<HTMLSelectElement> & {children: ReactNode}) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full appearance-none rounded-field border border-line-strong bg-canvas px-4 pr-10 text-base text-ink transition-colors focus:border-brand focus:outline-none aria-invalid:border-danger",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-text-muted" aria-hidden="true" />
    </div>
  );
}

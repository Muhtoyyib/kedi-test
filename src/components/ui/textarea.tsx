import type {TextareaHTMLAttributes} from "react";
import {cn} from "cn";

export function Textarea({className, ...props}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-field border border-line-strong bg-canvas px-4 py-3 text-base text-ink transition-colors placeholder:text-text-muted focus:border-brand focus:outline-none aria-invalid:border-danger",
        className
      )}
      {...props}
    />
  );
}

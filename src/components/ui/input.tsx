import type {InputHTMLAttributes} from "react";
import {cn} from "cn";

export const inputClasses =
  "h-12 w-full rounded-field border border-line-strong bg-canvas px-4 text-base text-ink transition-colors placeholder:text-text-muted focus:border-brand focus:outline-none aria-invalid:border-danger";

export function Input({className, ...props}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClasses, className)} {...props} />;
}

import type {InputHTMLAttributes} from "react";
import {cn} from "cn";

export function PhoneInput({className, "aria-invalid": ariaInvalid, ...props}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      aria-invalid={ariaInvalid}
      className={cn(
        "flex h-12 w-full items-stretch overflow-hidden rounded-field border border-line-strong bg-canvas transition-colors",
        "focus-within:border-brand aria-invalid:border-danger",
        "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-brand/45 has-[:focus-visible]:outline-offset-2",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="flex items-center border-r border-line-strong bg-surface px-3 text-base font-medium text-text-muted"
      >
        +234
      </span>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-invalid={ariaInvalid}
        className="min-w-0 flex-1 px-4 text-base text-ink focus:outline-none"
        {...props}
      />
    </div>
  );
}

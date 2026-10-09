import type {InputHTMLAttributes, ReactNode} from "react";
import {cn} from "cn";
import {Check} from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  id: string;
  label: ReactNode;
}

export function Checkbox({id, label, className, ...props}: CheckboxProps) {
  return (
    <label htmlFor={id} className={cn("flex min-h-11 cursor-pointer items-center gap-3 text-base text-ink", className)}>
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      {/* canvas text on canvas bg hides the tick until peer-checked paints the box */}
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-badge border-2 border-line-strong bg-canvas text-canvas transition-colors peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-3 peer-focus-visible:outline-brand/45 peer-focus-visible:outline-offset-2"
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
      <span>{label}</span>
    </label>
  );
}

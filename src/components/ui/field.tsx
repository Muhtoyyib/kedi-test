import {cloneElement, isValidElement, type ReactElement, type ReactNode} from "react";
import {cn} from "cn";
import {CircleAlert} from "lucide-react";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  children: ReactNode;
  className?: string;
}

export function Field({id, label, required, hint, error, children, className}: FieldProps) {
  const descriptionIds = [hint && !error ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, string | boolean | undefined>>, {
        id,
        "aria-describedby": descriptionIds,
        "aria-invalid": error ? true : undefined,
        required,
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label} {required ? <span className="font-normal text-text-muted">(required)</span> : null}
      </label>
      {control}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm text-danger">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

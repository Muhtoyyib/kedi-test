import type {ReactNode} from "react";
import {cn} from "cn";
import {CircleAlert, CircleCheck, Info, Sun} from "lucide-react";

const tones = {
  info: {classes: "bg-brand-soft text-ink", Icon: Info},
  sun: {classes: "bg-sun-soft text-sun-ink", Icon: Sun},
  success: {classes: "bg-leaf-soft text-ink", Icon: CircleCheck},
  danger: {classes: "bg-danger-soft text-danger", Icon: CircleAlert},
} as const;

export type NoticeTone = keyof typeof tones;

export function Notice({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: NoticeTone;
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  const {classes, Icon} = tones[tone];
  return (
    <div role="note" className={cn("flex gap-3 rounded-card p-4", classes, className)}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div className="text-sm leading-6">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}

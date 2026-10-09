import type {ReactNode} from "react";
import {cn} from "cn";

const variantClasses = {
  neutral: "bg-surface text-text-body",
  brand: "bg-brand-soft text-brand-strong",
  stock: "bg-leaf-soft text-leaf-strong",
  out: "bg-danger-soft text-danger",
  offer: "bg-sun text-ink",
} as const;

export type BadgeVariant = keyof typeof variantClasses;

export function Badge({variant = "neutral", className, children}: {variant?: BadgeVariant; className?: string; children: ReactNode}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-badge px-2.5 py-1 text-sm font-semibold", variantClasses[variant], className)}
    >
      {children}
    </span>
  );
}

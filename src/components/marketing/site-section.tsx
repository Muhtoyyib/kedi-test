import type {ComponentPropsWithoutRef, ElementType, ReactNode} from "react";
import {cn} from "cn";

type Tone = "canvas" | "surface" | "brand-soft" | "ink";
type Spacing = "default" | "tight";

interface SiteSectionProps<T extends ElementType = "section"> {
  as?: T;
  children: ReactNode;
  tone?: Tone;
  spacing?: Spacing;
  container?: boolean;
  className?: string;
  containerClassName?: string;
}

const toneClasses: Record<Tone, string> = {
  canvas: "bg-canvas",
  surface: "bg-surface",
  "brand-soft": "bg-brand-soft",
  ink: "bg-ink text-canvas",
};

const spacingClasses: Record<Spacing, string> = {
  default: "py-14 md:py-20",
  tight: "py-10 md:py-14",
};

export function SiteSection<T extends ElementType = "section">({
  as,
  children,
  tone = "canvas",
  spacing = "default",
  container = true,
  className,
  containerClassName,
  ...rest
}: SiteSectionProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof SiteSectionProps<T>>) {
  const Component = as ?? "section";
  return (
    <Component className={cn(toneClasses[tone], spacingClasses[spacing], className)} {...(rest as ComponentPropsWithoutRef<T>)}>
      {container ? <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8", containerClassName)}>{children}</div> : children}
    </Component>
  );
}

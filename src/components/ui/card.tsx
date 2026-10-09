import type {ComponentPropsWithoutRef, ElementType, ReactNode} from "react";
import {cn} from "cn";

interface CardProps<T extends ElementType = "div"> {
  as?: T;
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
}

export function Card<T extends ElementType = "div">({
  as,
  interactive = false,
  className,
  children,
  ...rest
}: CardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof CardProps<T>>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "rounded-card border border-line bg-canvas shadow-card",
        interactive && "transition-colors hover:border-brand focus-within:border-brand",
        className
      )}
      {...(rest as ComponentPropsWithoutRef<T>)}
    >
      {children}
    </Component>
  );
}

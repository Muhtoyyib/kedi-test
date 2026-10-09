import type {AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode} from "react";
import {cn} from "cn";
import {Spinner} from "./spinner";
import {WhatsAppIcon} from "./whatsapp-icon";

const variantClasses = {
  primary: "bg-brand text-canvas hover:bg-brand-hover",
  secondary: "border-2 border-brand-strong bg-canvas text-brand-strong hover:bg-brand-soft",
  whatsapp: "bg-whatsapp text-whatsapp-ink hover:bg-whatsapp-hover",
  sun: "bg-sun text-ink hover:bg-sun-hover",
  ghost: "text-ink hover:bg-surface",
  link: "h-auto rounded-none p-0 font-medium text-brand-strong underline underline-offset-4 hover:no-underline",
} as const;

const sizeClasses = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-7 text-lead",
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

interface ButtonVariantOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonVariants({variant = "primary", size = "md", fullWidth, className}: ButtonVariantOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    variant !== "link" && sizeClasses[size],
    variantClasses[variant],
    fullWidth && "w-full",
    className
  );
}

interface SharedProps extends ButtonVariantOptions {
  loading?: boolean;
  children?: ReactNode;
}

type ButtonAsButton = SharedProps & ButtonHTMLAttributes<HTMLButtonElement> & {href?: undefined};
type ButtonAsLink = SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & {href: string};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if (props.href !== undefined) return <ButtonLink {...props} />;
  return <ButtonNative {...props} />;
}

function ButtonInner({variant, loading, children}: {variant: ButtonVariant; loading?: boolean; children?: ReactNode}) {
  return (
    <>
      {variant === "whatsapp" ? <WhatsAppIcon size={20} /> : null}
      {loading ? <Spinner /> : null}
      {children}
    </>
  );
}

function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  loading = false,
  className,
  children,
  href,
  onClick,
  ...rest
}: ButtonAsLink) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }
  return (
    <a
      href={href}
      className={buttonVariants({variant, size, fullWidth, className})}
      rel={href.startsWith("http") ? "noopener" : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      <ButtonInner variant={variant} loading={loading}>
        {children}
      </ButtonInner>
    </a>
  );
}

function ButtonNative({
  variant = "primary",
  size = "md",
  fullWidth,
  loading = false,
  className,
  children,
  type = "button",
  disabled,
  ...rest
}: ButtonAsButton) {
  return (
    <button
      type={type}
      className={buttonVariants({variant, size, fullWidth, className})}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      <ButtonInner variant={variant} loading={loading}>
        {children}
      </ButtonInner>
    </button>
  );
}

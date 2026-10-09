import {cn} from "cn";
import {formatNaira} from "@/lib/format/naira";

const sizeClasses = {
  sm: "text-base",
  md: "text-price md:text-price-md",
} as const;

export function Price({
  amountNgn,
  size = "md",
  className,
}: {
  amountNgn: number | null;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  if (amountNgn === null) {
    return <span className={cn("font-semibold text-brand-strong", sizeClasses[size], className)}>Ask for price</span>;
  }
  return <span className={cn("font-extrabold tabular-nums text-ink", sizeClasses[size], className)}>{formatNaira(amountNgn)}</span>;
}

import {Minus, Plus} from "lucide-react";
import {cn} from "cn";
import {CART_MAX_QTY} from "@/lib/cart/types";

interface QuantityStepperProps {
  qty: number;
  onChange: (qty: number) => void;
  /** Compact rows in the drawer use the 40px variant; the PDP uses 48px. */
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({qty, onChange, size = "md", className}: QuantityStepperProps) {
  const buttonClass = cn(
    "flex shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-brand-soft disabled:pointer-events-none disabled:opacity-40",
    size === "sm" ? "size-10" : "size-11"
  );
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line-strong bg-canvas px-1",
        size === "md" && "h-12",
        className
      )}
    >
      <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => onChange(qty - 1)} className={buttonClass}>
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="w-8 text-center font-semibold tabular-nums">
        {qty}
      </output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={qty >= CART_MAX_QTY}
        onClick={() => onChange(qty + 1)}
        className={buttonClass}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

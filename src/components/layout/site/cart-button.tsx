import {ShoppingBag} from "lucide-react";
import {useHydrated} from "@/lib/use-hydrated";

// Header cart entry. Until change 05 wires the cart store it links to /shop;
// the count badge only renders after hydration so the prerendered HTML never
// shows a wrong number.
export function CartButton({count = 0}: {count?: number}) {
  const hydrated = useHydrated();
  const label = count === 1 ? "Cart, 1 item" : `Cart, ${count} items`;
  return (
    <a
      href="/shop"
      aria-label={label}
      className="relative flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {hydrated && count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun px-1 text-xs font-bold text-ink">
          {count}
        </span>
      ) : null}
    </a>
  );
}

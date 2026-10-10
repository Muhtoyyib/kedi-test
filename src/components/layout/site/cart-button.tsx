import {ShoppingBag} from "lucide-react";
import {cartDrawer} from "@/lib/cart/drawer-state";
import {useCartCount} from "@/lib/cart/use-cart-count";
import {markShellActivity} from "@/lib/shell-activity";
import {useHydrated} from "@/lib/use-hydrated";

// Header cart entry — opens the cart drawer. The count badge only renders
// after hydration so the prerendered HTML never shows a wrong number.
export function CartButton() {
  const hydrated = useHydrated();
  const count = useCartCount();
  const label = count === 1 ? "Cart, 1 item" : `Cart, ${count} items`;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        markShellActivity();
        cartDrawer.open();
      }}
      className="relative flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {hydrated && count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun px-1 text-xs font-bold text-ink">
          {count}
        </span>
      ) : null}
    </button>
  );
}

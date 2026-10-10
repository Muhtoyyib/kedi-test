import {useEffect, useRef} from "react";
import {ShoppingBag} from "lucide-react";
import {Drawer} from "@/components/ui/drawer";
import {Notice} from "@/components/ui/notice";
import {buttonVariants} from "@/components/ui/button";
import {track} from "@/lib/analytics/track";
import {cartDrawer} from "@/lib/cart/drawer-state";
import {useCart} from "@/lib/cart/use-cart";
import {formatNaira} from "@/lib/format/naira";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {CartLine} from "./cart-line";
import {CartSummary} from "./cart-summary";
import {OrderDetailsForm} from "./order-details-form";
import {SendOrderButton} from "./send-order-button";
import {useOrderDetails} from "./use-order-details";

const SAFETY_NOTE = "We only send payment details from our official WhatsApp number. Never pay into any other account.";

// The order review surface (design §3): lines → summary → safety → details →
// sticky send bar. Empty carts get a browse/ask state; the drawer stays open.
export function CartDrawer({open}: {open: boolean}) {
  const cart = useCart();
  const details = useOrderDetails();
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) track({event: "view_cart", item_count: cart.count, value: cart.subtotalNgn});
    wasOpen.current = open;
  }, [open, cart.count, cart.subtotalNgn]);

  const empty = cart.lines.length === 0;
  const title = empty ? "Your order" : `Your order (${cart.count} ${cart.count === 1 ? "item" : "items"})`;

  return (
    <Drawer open={open} onClose={cartDrawer.close} title={title} closeLabel="Close cart">
      {cart.removedIds.length === 1 ? <Notice tone="info">1 item is no longer available and was removed.</Notice> : null}
      {cart.removedIds.length > 1 ? (
        <Notice tone="info">{cart.removedIds.length} items are no longer available and were removed.</Notice>
      ) : null}
      {empty ? (
        <EmptyCart />
      ) : (
        <>
          <ul className="divide-y divide-line">
            {cart.lines.map((line) => (
              <CartLine key={line.product.id} line={line} cart={cart} />
            ))}
          </ul>
          <CartSummary subtotalNgn={cart.subtotalNgn} hasAskPrice={cart.hasAskPrice} />
          <Notice tone="sun" className="mt-4">
            {SAFETY_NOTE}
          </Notice>
          <div className="mt-6">
            <OrderDetailsForm state={details} checkout={{itemCount: cart.count, value: cart.subtotalNgn}} />
          </div>
          <div className="sticky bottom-0 -mx-5 mt-6 border-t border-line bg-canvas px-5 py-4">
            <div className="flex items-center gap-4">
              <p className="shrink-0 font-bold tabular-nums">{formatNaira(cart.subtotalNgn)}</p>
              <SendOrderButton state={details} className="min-w-0 flex-1" />
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-brand-soft">
        <ShoppingBag className="size-7 text-brand-strong" aria-hidden="true" />
      </div>
      <div>
        <p className="text-h3 font-bold text-text-heading">Your cart is empty</p>
        <p className="mt-1 text-text-muted">Browse our products or ask us what suits your routine.</p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <a href="/shop" onClick={cartDrawer.close} className={buttonVariants({variant: "primary", fullWidth: true})}>
          Shop products
        </a>
        <a
          href={buildWhatsAppLink(generalChatMessage())}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({variant: "whatsapp", fullWidth: true})}
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}

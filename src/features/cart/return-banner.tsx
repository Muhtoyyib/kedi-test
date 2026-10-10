import {useEffect, useRef, useState, useSyncExternalStore} from "react";
import {Button} from "@/components/ui/button";
import {cartDrawer} from "@/lib/cart/drawer-state";
import {cartStore, clearCart} from "@/lib/cart/store";
import {cartHash, clearPending, pendingSnapshot, subscribePending, type PendingOrder} from "@/lib/order/pending";
import {buildWhatsAppLink, openWhatsApp} from "@/lib/whatsapp/link";

// Resolves a cart after the customer returns from WhatsApp (spec §6): asks
// whether the stored order sent, then either clears the cart, resends the
// same message (no second Sheet write), or reopens the drawer.
export function ReturnBanner() {
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const pending = useSyncExternalStore(subscribePending, pendingSnapshot, () => null);
  const [dismissed, setDismissed] = useState(false);
  const [thanked, setThanked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const hash = cartHash(cart.lines);
  const show = pending !== null && pending.cartHash === hash && !dismissed;

  const confirmSent = () => {
    clearCart();
    clearPending();
    setThanked(true);
    timer.current = setTimeout(() => setThanked(false), 4000);
  };
  const resend = () => {
    if (pending) openWhatsApp(buildWhatsAppLink(pending.message));
  };
  const editOrder = () => {
    setDismissed(true);
    cartDrawer.open();
  };

  if (thanked) return <ThankYou />;
  if (!show) return null;
  return <AskingBar orderId={pending.orderId} onConfirm={confirmSent} onResend={resend} onEdit={editOrder} />;
}

function ThankYou() {
  return (
    <p role="status" className="border-b border-line bg-leaf-soft px-4 py-3 text-center text-sm font-medium text-leaf-strong">
      Thank you! We'll reply shortly to confirm stock, delivery fee and payment.
    </p>
  );
}

interface AskingBarProps {
  orderId: PendingOrder["orderId"];
  onConfirm: () => void;
  onResend: () => void;
  onEdit: () => void;
}

function AskingBar({orderId, onConfirm, onResend, onEdit}: AskingBarProps) {
  return (
    <div className="border-b border-line bg-sun-soft px-4 py-3">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-sun-ink">Did your order {orderId} send on WhatsApp?</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Yes, it's sent
          </Button>
          <Button variant="secondary" size="sm" onClick={onResend}>
            Open WhatsApp again
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit order
          </Button>
        </div>
      </div>
    </div>
  );
}

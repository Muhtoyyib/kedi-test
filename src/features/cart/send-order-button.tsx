import {useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {useCart} from "@/lib/cart/use-cart";
import {sendOrderViaWhatsApp} from "@/lib/order/send-order";
import {fieldId, firstInvalidField} from "./order-details-form";
import type {OrderDetailsState} from "./use-order-details";

// Validates the details form, then hands off to WhatsApp (send-order.ts).
// On failure: summary + focus on the first invalid field. Double-tap safe —
// the whole flow is synchronous and guarded by `busy`.
export function SendOrderButton({state, className}: {state: OrderDetailsState; className?: string}) {
  const {lines} = useCart();
  const [failCount, setFailCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const busy = useRef(false);

  const onSend = () => {
    if (busy.current) return;
    busy.current = true;
    setTimeout(() => {
      busy.current = false;
      setSending(false);
    }, 1500);

    state.showErrors();
    const result = sendOrderViaWhatsApp({details: state.details, lines, page: window.location.pathname});
    if (!result.ok) {
      const count = Object.keys(result.errors).length;
      setFailCount(count > 0 ? count : 1);
      const first = firstInvalidField(result.errors);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }
    setFailCount(null);
    setSending(true);
  };

  return (
    <div className={className}>
      {failCount !== null ? (
        <p role="alert" className="mb-3 rounded-field bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          Please fix {failCount} {failCount === 1 ? "field" : "fields"} to send your order
        </p>
      ) : null}
      <Button variant="whatsapp" size="lg" fullWidth loading={sending} onClick={onSend}>
        {sending ? "Opening WhatsApp…" : "Send order on WhatsApp"}
      </Button>
    </div>
  );
}

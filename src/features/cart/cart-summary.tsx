import {formatNaira} from "@/lib/format/naira";
import {getSettings} from "@/lib/catalog/settings";

interface CartSummaryProps {
  subtotalNgn: number;
  hasAskPrice: boolean;
}

// Subtotal / delivery / free-delivery hint / Sheet delivery note. Delivery
// itself is always confirmed on WhatsApp, never calculated here.
export function CartSummary({subtotalNgn, hasAskPrice}: CartSummaryProps) {
  const settings = getSettings();
  const threshold = settings.freeDeliveryThresholdNgn;
  const showHint = threshold !== null && subtotalNgn > 0 && subtotalNgn < threshold;
  return (
    <div className="rounded-card bg-surface p-4">
      <dl className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-text-body">Subtotal</dt>
          <dd className="font-bold tabular-nums">
            {formatNaira(subtotalNgn)}
            {hasAskPrice ? <span className="ml-1 text-sm font-normal text-text-muted">+ items to confirm</span> : null}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-text-body">Delivery</dt>
          <dd className="text-text-body">Confirmed on WhatsApp</dd>
        </div>
      </dl>
      {showHint ? <p className="mt-2 text-sm text-leaf-strong">Add {formatNaira(threshold - subtotalNgn)} more for free delivery</p> : null}
      {settings.deliveryNote ? <p className="mt-2 text-sm text-text-muted">{settings.deliveryNote}</p> : null}
    </div>
  );
}

// The send-order flow (design §5): validate → order ID → payload → message →
// background Sheet beacon → pending marker → remember details → track → open
// WhatsApp. The Sheet write is never awaited — WhatsApp always opens.

import {getAttribution} from "@/lib/attribution";
import {track} from "@/lib/analytics/track";
import {selectHasAskPrice, selectSubtotal, type PricedLine} from "@/lib/cart/selectors";
import {buildWhatsAppLink, openWhatsApp} from "@/lib/whatsapp/link";
import {orderMessage} from "@/lib/whatsapp/messages";
import {sendOrder} from "./beacon";
import {saveDetails, validateDetails, type DetailsField, type OrderDetails} from "./details";
import {createOrderId} from "./order-id";
import {areaText, buildOrderPayload} from "./payload";
import {cartHash, savePending} from "./pending";

export type SendResult = {ok: true; orderId: string} | {ok: false; errors: Partial<Record<DetailsField, string>>};

export interface SendInput {
  details: OrderDetails;
  lines: PricedLine[];
  page: string;
  now?: Date;
  /** Test seam — defaults to {@link openWhatsApp}. */
  open?: (link: string) => void;
}

export function sendOrderViaWhatsApp(input: SendInput): SendResult {
  const {details, lines, page} = input;
  const {errors, phoneE164} = validateDetails(details);
  if (Object.keys(errors).length > 0 || !phoneE164 || lines.length === 0) return {ok: false, errors};

  const orderId = createOrderId(input.now ?? new Date());
  const attribution = typeof localStorage === "undefined" ? null : getAttribution(localStorage);
  const payload = buildOrderPayload({lines, details, phoneE164, context: {page, attribution}, orderId});
  const subtotalNgn = selectSubtotal(lines);
  const message = orderMessage({
    orderId,
    lines,
    subtotalNgn,
    hasAskPrice: selectHasAskPrice(lines),
    customerName: details.name.trim(),
    areaText: areaText(details),
    referralCode: details.referralCode.trim(),
  });
  const link = buildWhatsAppLink(message);

  sendOrder(payload, details.company);
  savePending({
    orderId,
    at: (input.now ?? new Date()).getTime(),
    cartHash: cartHash(lines.map((l) => ({productId: l.product.id, qty: l.qty}))),
    message,
  });
  saveDetails({name: details.name.trim(), phone: details.phone, area: details.area, areaOther: details.areaOther});
  track({
    event: "whatsapp_order_sent",
    order_id: orderId,
    item_count: lines.reduce((n, l) => n + l.qty, 0),
    value: subtotalNgn,
    has_referral: details.referralCode.trim() !== "",
  });

  (input.open ?? openWhatsApp)(link);
  return {ok: true, orderId};
}

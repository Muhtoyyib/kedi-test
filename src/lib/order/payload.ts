// Builds the order payload posted to the Apps Script intake endpoint —
// mirrors OrderPayload in apps-script/src/orders.ts.

import type {Attribution} from "@/lib/attribution";
import {selectSubtotal, type PricedLine} from "@/lib/cart/selectors";
import {OTHER_AREA, type OrderDetails} from "./details";

export interface OrderPayload {
  orderId: string;
  customerName: string;
  phone: string;
  area: string;
  items: {productId: string; qty: number}[];
  subtotal: number;
  referralCode: string;
  followupConsent: boolean;
  utm: {source: string; medium: string; campaign: string};
  page: string;
}

export interface OrderContext {
  page: string;
  attribution: Attribution | null;
}

/** The delivery-area text shared by the payload and the WhatsApp message. */
export function areaText(details: OrderDetails): string {
  return details.area === OTHER_AREA ? `Other — ${details.areaOther.trim()}` : details.area;
}

export interface BuildPayloadInput {
  lines: PricedLine[];
  details: OrderDetails;
  phoneE164: string;
  context: OrderContext;
  orderId: string;
}

export function buildOrderPayload(input: BuildPayloadInput): OrderPayload {
  const {lines, details, phoneE164, context, orderId} = input;
  const utm = context.attribution ?? {source: "", medium: "", campaign: ""};
  return {
    orderId,
    customerName: details.name.trim(),
    phone: phoneE164,
    area: areaText(details),
    items: lines.map((l) => ({productId: l.product.id, qty: l.qty})),
    subtotal: selectSubtotal(lines),
    referralCode: details.referralCode.trim(),
    followupConsent: details.followupConsent,
    utm: {source: utm.source, medium: utm.medium, campaign: utm.campaign},
    page: context.page,
  };
}

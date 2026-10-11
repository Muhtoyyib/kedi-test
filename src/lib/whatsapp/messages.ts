// Pre-filled WhatsApp message text (docs/whatsapp-messages.md). None of
// these include personal data the visitor didn't type.

import {formatNaira} from "@/lib/format/naira";
import type {PricedLine} from "@/lib/cart/selectors";
import type {Product} from "@/lib/catalog/types";
import {siteConfig} from "../site-config";

export function generalChatMessage(): string {
  return `Hello ${siteConfig.name}! I'd like some advice on which KEDI product is right for me.`;
}

export function productAskMessage(product: Pick<Product, "name" | "packSize">): string {
  return `Hello ${siteConfig.name}! I'd like to ask about ${product.name} (${product.packSize}).`;
}

export function outOfStockMessage(product: Pick<Product, "name" | "packSize">): string {
  return `Hello ${siteConfig.name}! ${product.name} (${product.packSize}) shows out of stock. When will it be available?`;
}

export function searchEnquiry(term: string): string {
  return `Hello ${siteConfig.name}! I searched your website for "${term}" but couldn't find it. Do you have it?`;
}

export interface OrderMessageInput {
  orderId: string;
  lines: PricedLine[];
  subtotalNgn: number;
  hasAskPrice: boolean;
  customerName: string;
  areaText: string;
  referralCode: string;
}

/** docs/whatsapp-messages.md §1 — the cart order message. */
export function orderMessage(input: OrderMessageInput): string {
  const items = input.lines.map(
    (l) => `• ${l.product.name} × ${l.qty} — ${l.lineTotalNgn === null ? "price to confirm" : formatNaira(l.lineTotalNgn)}`
  );
  const subtotal = input.hasAskPrice
    ? `Subtotal: ${formatNaira(input.subtotalNgn)} + items to confirm`
    : `Subtotal: ${formatNaira(input.subtotalNgn)} (delivery fee to be confirmed)`;
  const lines = [
    `Hello ${siteConfig.name}! I'd like to place an order.`,
    "",
    `Order ID: ${input.orderId}`,
    ...items,
    subtotal,
    "",
    `Name: ${input.customerName}`,
    `Delivery area: ${input.areaText}`,
  ];
  if (input.referralCode) lines.push(`Referral code: ${input.referralCode}`);
  return lines.join("\n");
}

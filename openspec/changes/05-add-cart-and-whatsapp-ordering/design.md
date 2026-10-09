## Context

See plan §3.5 and the technical notes there. Endpoint contract: `docs/architecture.md` §7. Message format: `docs/whatsapp-messages.md` §1. Events: `docs/analytics-events.md`.

## Goals / Non-Goals

**Goals**

- Tap "Send order on WhatsApp" → WhatsApp opens in under 300 ms, with no network wait.
- Order logged in ≥ 99% of sends (the beacon survives navigation).
- Cart JS ≤ 25 KB gzip, loaded only on interaction (the drawer is lazy).

**Non-Goals**

- Online payment, delivery fee calculation in the cart (the distributor confirms the fee), stock reservation, accounts.

## Decisions

### Module map

```
src/lib/cart/
  types.ts         CartLine {productId, qty}; Cart {lines, updatedAt, version: 1}
  store.ts         external store (useSyncExternalStore) over localStorage "cart:v1" + "storage" event sync
  reducer.ts       add / setQty / remove / clear (pure, tested)
  selectors.ts     lines joined with catalog → {product, qty, lineTotal}; subtotal; hasAskPrice; count
src/lib/order/
  order-id.ts      createOrderId(now, random) → KD-YYMMDD-XXXX (Africa/Lagos date)
  payload.ts       buildOrderPayload(cart, details, context) → OrderPayload
  beacon.ts        sendOrder(payload): sendBeacon → fetch keepalive fallback → returns "queued" | "unavailable"
  pending.ts       sessionStorage "pending-order" {orderId, at, cartHash}
src/lib/whatsapp/
  link.ts          buildWhatsAppLink(text, {number?}) ; isMobile()
  messages.ts      orderMessage(…), productEnquiry(…), outOfStock(…), generalChat(), seminarQuestion(), business(), contact(), storySubmission(), referralShare(…)
src/features/cart/
  cart-drawer.tsx, cart-line.tsx, cart-summary.tsx, order-details-form.tsx, send-order-button.tsx, return-banner.tsx, add-to-cart-button.tsx, quantity-stepper.tsx
```

The cart stores only `productId` and `qty`. Names and prices always come from the current catalog. A product that disappears from the catalog is dropped from the cart, and the drawer says so once.

### OrderPayload

```ts
interface OrderPayload {
  orderId: string; // KD-261012-7F3K
  createdAt: string; // ISO
  items: {productId: string; name: string; unitPriceNgn: number | null; qty: number}[];
  subtotalNgn: number; // excludes ask-price lines
  hasAskPrice: boolean;
  customer: {name: string; phone: string; area: string; areaOther?: string};
  referralCode: string | null;
  followupConsent: boolean;
  context: {page: string; utmSource?: string; utmMedium?: string; utmCampaign?: string};
  hp: ""; // honeypot value from the hidden field
}
```

### Why same-tab navigation

`window.open` after an async step is blocked by mobile pop-up blockers, and a new tab on Android leaves the site in a background tab that the OS may kill. `location.href = waLink` inside the click handler is never blocked. Desktop (`pointer: fine` and width ≥ 1024) opens WhatsApp Web in a new tab synchronously in the click handler, so the cart stays visible.

## Risks / Trade-offs

- [The customer never sends the WhatsApp message] → The order is still logged as "Started on website", and the daily email lists it after 24 h (change 03).
- [`sendBeacon` is unavailable or returns false] → Fall back to `fetch(url, {method:"POST", body, keepalive:true, mode:"no-cors"})`. If both are impossible (no endpoint configured), WhatsApp still opens; the order exists only in WhatsApp.
- [Prices change while an item sits in the cart] → The cart always shows current prices. Apps Script recomputes from the Sheet at intake.

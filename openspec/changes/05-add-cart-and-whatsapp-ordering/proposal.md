## Why

Ordering is the core of the site. The plan (§3.5) replaces checkout with a cart that opens WhatsApp with a ready-made order message, while the order is logged to the Sheet in the background. It must be fast on 3G, never lose an order, and work around pop-up blockers.

## What Changes

Six sections, in dependency order:

1. `sections/01-cart-store`: cart state in localStorage, shared across tabs, with typed parsing and a 20-line cap.
2. `sections/02-add-to-cart-controls`: Add to cart button, quantity stepper and "added" feedback, used on product cards, product pages and the sticky bar.
3. `sections/03-cart-drawer`: the drawer listing items, quantities, subtotal, delivery note and payment-safety note.
4. `sections/04-order-details-form`: name, phone, delivery area (from the Sheet), referral code, optional follow-up consent.
5. `sections/05-send-order-flow`: order ID, message, beacon to Apps Script, same-tab redirect to WhatsApp.
6. `sections/06-return-from-whatsapp`: when the customer comes back, ask whether the message was sent; then clear or resend.

Also adds `src/lib/whatsapp/{link,messages}.ts` (if change 02 has not already) and `src/lib/order/*`.

## Capabilities

### New Capabilities

- `ordering/cart-store`: cart persistence and limits.
- `ordering/add-to-cart`: adding products and feedback.
- `ordering/cart-drawer`: reviewing and editing the cart.
- `ordering/order-details`: collecting the customer details needed for an order.
- `ordering/send-order`: creating, logging and sending the order through WhatsApp.
- `ordering/return-from-whatsapp`: resolving the cart after the customer returns.

## Impact

- Depends on 01 (Drawer, PhoneInput, Toast), 02 (cart button, drawer mount), 03 (order endpoint), 04 (prices, delivery areas, settings). Uses 06's stored referral code once 06 lands (reads `getStoredReferralCode()`; returns null until then).
- Client inputs: WhatsApp number, delivery areas and fees, bank details (payment-safety note), `delivery_note`.

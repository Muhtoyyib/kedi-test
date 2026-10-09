## Why

After WhatsApp opens, the site can't know whether the customer pressed send in WhatsApp. If we clear the cart too early, a customer who backed out loses it. If we never clear it, the next visit shows an old order.

## What Changes

- When the customer returns to the site (page shown again from the back/forward cache, tab refocused, or a new page view within 24 h) with a pending order, show a banner: "Did your order {orderId} send on WhatsApp?" with **Yes, it's sent** (clears the cart and pending marker), **Open WhatsApp again** (re-opens the same message) and **Edit order** (opens the drawer).
- The banner auto-expires after 24 h (the cart is kept; the pending marker is dropped).

Spec: `../../specs/ordering/return-from-whatsapp/spec.md`

## Impact

- `src/features/cart/return-banner.tsx`, uses `pending.ts`.

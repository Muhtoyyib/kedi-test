## Why

This is the conversion moment. WhatsApp must open immediately with a correct, readable order, and the same order must reach the Sheet without making the customer wait.

## What Changes

- `SendOrderButton`: validates details, creates the order ID, builds the payload and message, queues the beacon, stores a pending marker, tracks `whatsapp_order_sent`, then opens WhatsApp (same tab on mobile, new tab on desktop).
- `src/lib/order/{order-id,payload,beacon,pending}.ts` and `orderMessage()`.

Spec: `../../specs/ordering/send-order/spec.md`

## Impact

- Requires `VITE_APPS_SCRIPT_URL`. Without it, logging is skipped (dev warning) and WhatsApp still opens.

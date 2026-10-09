## Why

Before sending, customers need to check items and quantities, see a running subtotal, know that the delivery fee is confirmed on WhatsApp, and be reassured about safe payment.

## What Changes

- `CartDrawer` (bottom sheet on mobile, right panel on desktop) with: title and count, line items with steppers and remove, subtotal, delivery note, payment-safety note, then the order-details form (section 04) and the send button (section 05).
- Empty state with links to Shop and WhatsApp.

Spec: `../../specs/ordering/cart-drawer/spec.md`

## Impact

- `src/features/cart/{cart-drawer,cart-line,cart-summary}.tsx`
- Reads settings: `deliveryNote`, `freeDeliveryThresholdNgn`, `bank`.

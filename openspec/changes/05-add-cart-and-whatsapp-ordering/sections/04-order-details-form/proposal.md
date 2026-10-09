## Why

The distributor needs a name, a reachable phone number and a delivery area to confirm stock, fee and payment. Asking for these on the site (not just in WhatsApp) means the Sheet record is useful even if the customer never sends the message.

## What Changes

- `OrderDetailsForm` inside the drawer: full name, WhatsApp phone, delivery area (select from the Sheet's Delivery tab + "Other"), "Other area" text when needed, referral code (pre-filled from the stored `?ref`), optional follow-up consent, hidden honeypot.
- Values are remembered on the device (`localStorage["order-details:v1"]`) for the next order, except consent, which always starts unticked.

Spec: `../../specs/ordering/order-details/spec.md`

## Impact

- `src/features/cart/order-details-form.tsx`, `src/lib/order/details.ts` (parse/validate).
- Reads `getDeliveryAreas()` and `getStoredReferralCode()` (change 06).

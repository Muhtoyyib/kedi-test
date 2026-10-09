## Why

Impersonators target WhatsApp sellers. The plan's rule: payment details are only sent from the official number and are listed on the website (§7).

## What Changes

- A `sun-soft` notice with the official bank details (from Settings), the official WhatsApp number, and the warning text.

Spec: `../../specs/contact/payment-safety/spec.md`

## Impact

- `src/features/contact/components/payment-safety.tsx` (also reused as `<BankDetails />` MDX component in legal pages).

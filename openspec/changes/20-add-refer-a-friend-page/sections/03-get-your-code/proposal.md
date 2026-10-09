## Why

The code must be generated instantly on the page (no waiting for a server) and recorded in the Sheet so rewards can be tracked.

## What Changes

- Form: first name, WhatsApp number, consent → generates `AMAKA-4821` and the link locally, registers in the background, shows the result, and remembers it on the device.

Spec: `../../specs/refer/get-your-code/spec.md`

## Impact

- `src/features/refer/components/get-your-code.tsx`; uses change 06's `createReferralCode`, `buildReferralLink`, `registerReferralCode`.

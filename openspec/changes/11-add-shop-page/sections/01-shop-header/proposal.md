## Why

Visitors arriving at /shop need a clear title and a one-line reminder of how ordering works (no checkout; WhatsApp), so the "Send order on WhatsApp" step isn't a surprise.

## What Changes

- Page title, intro and a three-step "How ordering works" strip.

Spec: `../../specs/shop/shop-header/spec.md`

## Impact

- `src/features/shop/components/shop-header.tsx`; uses `StepList` (compact).

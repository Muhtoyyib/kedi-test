## Why

The cart must survive refreshes, app switches (WhatsApp ↔ browser) and multiple tabs, without trusting stale prices or broken storage.

## What Changes

- `src/lib/cart/{types,reducer,store,selectors}.ts` and a `useCart()` hook.
- Persistence in `localStorage["cart:v1"]`, synced across tabs through the `storage` event.
- Limits: max 20 lines, qty 1–20 per line.

Spec: `../../specs/ordering/cart-store/spec.md`

## Impact

- No UI. Used by all other sections and the header badge.

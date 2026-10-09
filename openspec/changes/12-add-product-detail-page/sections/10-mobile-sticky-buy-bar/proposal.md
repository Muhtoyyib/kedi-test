## Why

On phones the purchase panel scrolls away while the customer reads. A slim bar with the price, Add to cart and WhatsApp keeps the action in reach.

## What Changes

- A fixed bottom bar below 768px, shown once the purchase panel's main button scrolls out of view: thumbnail, name, price, Add to cart, and a WhatsApp icon button.

Spec: `../../specs/product-detail/sticky-buy-bar/spec.md`

## Impact

- `src/features/product-detail/components/sticky-buy-bar.tsx`; replaces the floating WhatsApp button on mobile for this page.

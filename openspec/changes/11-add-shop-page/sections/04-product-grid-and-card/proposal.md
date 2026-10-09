## Why

The product card is the most-used component on the site (home, shop, related products). It must show what a buyer needs (image, name, benefit, pack, price, stock) and allow adding to the cart in one tap, in a two-column phone grid.

## What Changes

- `ProductCard` (`src/components/marketing/product-card.tsx`) with `full` and `compact` density.
- `ProductGrid` (`src/features/shop/components/product-grid.tsx`): responsive grid, `view_item_list` tracking, `select_item` on card link tap.

Spec: `../../specs/shop/product-grid/spec.md`

## Impact

- Shared with change 10 (featured products) and change 12 (related products).
- Uses `AddToCartButton variant="card"` (change 05) and `ResponsiveImage`, `Price`, `Badge` (01).

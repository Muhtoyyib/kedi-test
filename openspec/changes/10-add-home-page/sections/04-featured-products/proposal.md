## Why

Visitors who already know what they want should be able to add a best-seller to the cart without leaving the home page.

## What Changes

- A grid of 4–8 featured products using `ProductCard` (from `11-add-shop-page/sections/04-product-grid-and-card`), with a "View all products" link and category shortcuts.

Spec: `../../specs/home/featured-products/spec.md`

## Impact

- `src/features/home/components/featured-products.tsx`
- Data: `getFeaturedProducts(8)`, `getCategories()`.
- Client input: `featured = Yes` on 4–8 products in the Sheet.

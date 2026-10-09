## Why

Customers often shop by need (digestion, immunity, men's or women's wellness). Category chips let them narrow the list in one tap. Each chip is a real page, so it works without JavaScript and ranks in search.

## What Changes

- A sticky, horizontally scrolling chip row: "All products" + each active category, linking to `/shop` and `/shop/{slug}`, with the current one marked.

Spec: `../../specs/shop/category-filter/spec.md`

## Impact

- `src/features/shop/components/category-filter.tsx` (links styled with `ChipGroup` visuals, but they are links, not toggles).
- Tracks `filter_category`.

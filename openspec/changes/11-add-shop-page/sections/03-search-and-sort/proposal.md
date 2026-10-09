## Why

Returning customers know the product name they want. Search finds it instantly. Sorting by price helps budget-conscious buyers.

## What Changes

- A search field filtering the current listing as you type (name, short benefit, category name, pack size), and a sort select: Recommended, Price: low to high, Price: high to low, Name A–Z.
- State in the URL (`?q=`, `?sort=`), a result count announced to screen readers.

Spec: `../../specs/shop/search-and-sort/spec.md`

## Impact

- `src/features/shop/components/search-and-sort.tsx`, `src/lib/shop/filter.ts` (pure search + sort).

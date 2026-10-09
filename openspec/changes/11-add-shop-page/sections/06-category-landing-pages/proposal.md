## Why

Category pages are landing pages from Google ("KEDI digestive products in [City]") and from ads. They need their own heading, description, breadcrumbs and metadata.

## What Changes

- `CategoryHeader` on `/shop/$category`: breadcrumbs (Home › Shop › Category), h1 = category name, the category description, optional category image, product count.
- Meta and JSON-LD per the page design.

Spec: `../../specs/shop/category-pages/spec.md`

## Impact

- `src/features/shop/components/category-header.tsx`
- Client input: category descriptions (plain wellness wording; no disease names).

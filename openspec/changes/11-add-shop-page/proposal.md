## Why

The catalogue is where intentional buyers find and order products (plan §3.3, page 2). It must be fast to scan on a phone, filterable by category, searchable, and let customers add to cart without opening each product.

## What Changes

- `/shop` (all products) and `/shop/$category` (one page per category, prerendered for SEO) share `src/features/shop/view.tsx` with sections:

| #   | Folder                               | Section                                                |
| --- | ------------------------------------ | ------------------------------------------------------ |
| 1   | `sections/01-shop-header`            | Title, intro, ordering reassurance                     |
| 2   | `sections/02-category-filter`        | Category chips (links to category pages)               |
| 3   | `sections/03-search-and-sort`        | Client-side search within the listing and sort         |
| 4   | `sections/04-product-grid-and-card`  | Product grid and the shared `ProductCard`              |
| 5   | `sections/05-empty-and-no-results`   | No products in a category / no search matches          |
| 6   | `sections/06-category-landing-pages` | Category page header, description, SEO and breadcrumbs |
| 7   | `sections/07-help-cta`               | "Not sure which to choose?" WhatsApp help band         |

## Capabilities

### New Capabilities

- `shop/page`: routes, metadata and composition for `/shop` and `/shop/$category`.
- `shop/shop-header`, `shop/category-filter`, `shop/search-and-sort`, `shop/product-grid`, `shop/empty-states`, `shop/category-pages`, `shop/help-cta`.

## Impact

- Depends on 01, 02, 04, 05 (add-to-cart controls), 07 (meta, BreadcrumbList).
- `ProductCard` is shared with home (10) and product detail related products (12). Build section 04 before those.
- Client inputs: categories and products in the Sheet.

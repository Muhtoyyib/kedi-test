## 1. Page

- [ ] 1.1 Routes `shop.index.tsx` and `shop.$category.tsx` (notFound for unknown slugs), meta per design
- [ ] 1.2 `src/features/shop/view.tsx` composition and `use-shop-query.ts` (validateSearch for `q` and `sort`) + tests
- [ ] 1.3 Page test: /shop renders all fixture products; /shop/{slug} renders only that category; unknown category → not found

## 2. Sections

- [ ] 2.1 `sections/04-product-grid-and-card` complete (first: shared card)
- [ ] 2.2 `sections/01-shop-header` complete
- [ ] 2.3 `sections/02-category-filter` complete
- [ ] 2.4 `sections/03-search-and-sort` complete
- [ ] 2.5 `sections/05-empty-and-no-results` complete
- [ ] 2.6 `sections/06-category-landing-pages` complete
- [ ] 2.7 `sections/07-help-cta` complete

## 3. Verification

- [ ] 3.1 `vp run lint`, `vp test --run`, `vp run build` pass; every category page prerendered
- [ ] 3.2 JS disabled: /shop lists all products with prices and links
- [ ] 3.3 360px: two-column grid, cards readable, add-to-cart reachable with a thumb
- [ ] 3.4 Lighthouse mobile on /shop: Performance ≥ 90 with 30 products

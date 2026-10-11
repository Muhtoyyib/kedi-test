## 1. Page

- [x] 1.1 Route `products.$slug.tsx` with loader, notFound, meta, JSON-LD and `view_item`
- [x] 1.2 `view.tsx` layout per design, including the `AnchorNav` (md+) and `hideFloatingWhatsApp="mobile"` (extend `SiteLayout` if needed)
- [x] 1.3 Page tests: unknown slug → not found; sections render in order with fixture product; ask-price product; out-of-stock product

## 2. Sections

- [x] 2.1 `sections/01-breadcrumbs` complete
- [x] 2.2 `sections/02-image-gallery` complete
- [x] 2.3 `sections/03-purchase-panel` complete
- [x] 2.4 `sections/04-description-and-ingredients` complete
- [x] 2.5 `sections/05-how-to-use` complete
- [x] 2.6 `sections/06-product-facts` complete
- [x] 2.7 `sections/07-product-faqs` complete
- [x] 2.8 `sections/08-related-products` complete
- [x] 2.9 `sections/09-health-disclaimer` complete
- [x] 2.10 `sections/10-mobile-sticky-buy-bar` complete

## 3. Verification

- [x] 3.1 `vp run lint`, `vp test --run`, `vp run build` pass (all fixture product pages prerendered)
- [ ] 3.2 Rich Results Test: Product valid (with Offer when priced; without when ask-price)
- [ ] 3.3 360px: price and Add to cart visible within the first screen or via the sticky bar at all times
- [x] 3.4 Text audit: every visible product sentence matches a Sheet field verbatim

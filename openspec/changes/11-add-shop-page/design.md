## Decisions

### Routes

- `src/routes/shop.index.tsx` → `ShopView({category: null})`
- `src/routes/shop.$category.tsx` → `loader` resolves `getCategory(params.category)`; unknown → `throw notFound()`. `ShopView({category})`.
- Prerender: `/shop` plus `/shop/{slug}` for every active category (change 04 adds these to the page list).

### Composition

```
SiteLayout
  ShopHeader (01)  — or CategoryHeader (06) on category pages
  CategoryFilter (02)
  SearchAndSort (03)  [client island]
  ProductGrid (04)    [products filtered/sorted by the island's state; server renders all, in default order]
  EmptyState (05)
  HelpCta (07)
```

`SearchAndSort` and `ProductGrid` share state through a small `useShopQuery()` hook that reads and writes `?q=` and `?sort=` with TanStack Router `validateSearch`, so states are shareable links. The prerendered HTML contains every product in default order (no JS needed to browse).

### Meta

- `/shop`: title "Shop KEDI products | {Brand}", description "Browse genuine KEDI wellness products with prices. Add to cart and send your order on WhatsApp for delivery in {City}."
- `/shop/{slug}`: title "{Category name} — KEDI products | {Brand}", description = category description (≤ 155, truncated at a word).
- JSON-LD: `BreadcrumbList` (Home › Shop › Category) and an `ItemList` of product URLs.

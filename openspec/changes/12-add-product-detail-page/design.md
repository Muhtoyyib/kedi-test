## Decisions

### Route

`src/routes/products.$slug.tsx`: `loader` → `getProductBySlug(params.slug)` or `throw notFound()`. `head()` → `buildMeta({title: product.seo.title, description: product.seo.description, path, image: main image 1200w, kind:"product"})` + `Product` and `BreadcrumbList` JSON-LD. The component tracks `view_item` on mount.

### Layout

```
Breadcrumbs (01)
┌─────────────── md: grid-cols-2 gap-10 ───────────────┐
│ Gallery (02)                │ PurchasePanel (03)     │  ← panel md:sticky md:top-24
└─────────────────────────────┴────────────────────────┘
In-page nav (md+): About · How to use · Facts · FAQs    ← AnchorNav, sticky under header (md+ only)
About this product (04)
How to use (05)
Product facts (06)
Questions about {name} (07)
You may also like (08)
Health disclaimer (09)
StickyBuyBar (10, < md only)
```

Content sections (04–07) are `max-w-3xl`, inside `SiteSection spacing="tight"`, with `scroll-mt-28` anchors `#about`, `#how-to-use`, `#facts`, `#faqs`. The page uses `SiteLayout hideFloatingWhatsApp` (the sticky bar has WhatsApp on mobile; on md+ the purchase panel's WhatsApp button covers it, and the floating button is shown again on md+ only: pass `hideFloatingWhatsApp="mobile"`).

### Compliance

Sections 04, 05 and 07 render Sheet text verbatim (paragraph and line splitting only). No extra adjectives, icons implying medical effect, or generated summaries.

## Layout

- `SiteSection tone="brand-soft" spacing="tight"`.
- `Breadcrumbs`: Home › Shop › {Category}.
- md+: two columns — text (h1 `text-h1`, description `text-lead`, count `text-sm text-text-muted` "{n} products") and the category image (4:3, rounded-card) if provided. Mobile: text only (the image is skipped to save data).
- The ordering steps strip from section 01 follows below.

## SEO

- Title/description per page design.
- `BreadcrumbList` JSON-LD with three items.
- `ItemList` JSON-LD: `itemListElement` of `{position, url}` for products in default order.

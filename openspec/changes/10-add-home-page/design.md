## Context

Pattern: Rixl `src/features/home/view.tsx` (view composes section components; content builders separate). Sections receive data as props from `view.tsx`, which reads the catalog/content helpers once.

## Decisions

### Data loading

```ts
// src/features/home/view.tsx
const featured = getFeaturedProducts(8);
const nextSeminar = getNextSeminar(new Date(BUILD_TIME)); // re-evaluated client-side inside the banner
const stories = getStories({featured: true}).slice(0, 3);
const articles = getArticles().slice(0, 3);
const settings = getSettings();
```

### Spacing and rhythm

The view wraps sections in `SiteSection` with alternating tones (see the proposal table). Hero uses `spacing="tight"` at the top (`pt-6 md:pt-12`). The total page height target on mobile is ≤ 9 screens.

### Meta

- Title: `{name} — Your trusted KEDI wellness partner in {city}` (≤ 60 chars; if longer, drop "trusted").
- Description: "Genuine KEDI products in {city} with free weekly wellness seminars, personal guidance and follow-up. Order easily on WhatsApp."
- OG image: default OG image.
- JSON-LD: Organization/LocalBusiness + WebSite (root, change 07). No extra page-level types.

### Performance

- The hero image is the LCP element: `priority`, `sizes="(min-width: 768px) 45vw, 100vw"`, AVIF ≤ 80 KB at 768w.
- Only the hero, the add-to-cart buttons, the seminar banner (client time check) and Reveal animations hydrate.

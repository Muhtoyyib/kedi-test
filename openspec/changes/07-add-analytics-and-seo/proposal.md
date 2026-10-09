## Why

The plan measures everything (§9) and depends on Google search and local "near me" discovery (§3.3 Learn, Google Business Profile). Without consistent metadata, structured data and events, the weekly dashboard review and ad optimisation can't work.

## What Changes

- **Analytics:** `src/lib/analytics/{track,loaders,events}.ts`. GA4, Meta Pixel and Clarity load only after consent (change 02 §06), deferred to idle. A typed event union from `docs/analytics-events.md`.
- **Attribution:** `src/lib/attribution.ts` captures UTM parameters on landing (session-scoped) for orders and forms.
- **SEO metadata:** `src/lib/seo/meta.ts` → `buildMeta({title, description, path, image?, noindex?})` returning TanStack `head()` meta + canonical + Open Graph + Twitter tags. A default OG image (`public/og/default.jpg`, 1200×630, brand blue with the sun arc and the brand name).
- **Structured data:** `src/lib/seo/jsonld.ts` builders: `Organization` + `LocalBusiness` (`HealthAndBeautyBusiness`), `WebSite`, `Product` + `Offer`, `BreadcrumbList`, `Event` (seminars), `FAQPage`, `Article`. Rendered as `application/ld+json` scripts in `head()`.
- **Sitemap and robots:** prerendered `/sitemap.xml` (from the routes doc and catalog/content) and `/robots.txt`.
- **Search Console** verification by DNS (documented), sitemap submission checklist.

## Capabilities

### New Capabilities

- `analytics/tracking`: consent-gated event tracking without personal data.
- `analytics/attribution`: campaign source capture for orders and leads.
- `seo/metadata`: titles, descriptions, canonical and social previews.
- `seo/structured-data`: schema.org data for products, business, seminars, FAQs and articles.
- `seo/sitemap`: sitemap and robots.

## Impact

- Depends on 00, 02 (consent), 04 (catalog for sitemap: products, categories and articles), 08 (legal pages).
- Client inputs: GA4, Meta Pixel and Clarity IDs; domain; Google Business Profile URL (added to `sameAs`).

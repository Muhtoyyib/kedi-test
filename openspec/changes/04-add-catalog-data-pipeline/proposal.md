## Why

Products, prices, stock, delivery fees, bank details and seminar dates change often and are owned by the client. The site must show them accurately without the client touching code, and must never publish broken data.

## What Changes

- Implement `scripts/fetch-catalog.ts` (stubbed in change 00): fetch the catalog from the Apps Script, validate it, download and convert images, and write `src/generated/catalog.json` and `src/generated/images.json`.
- Image pipeline with `sharp`: AVIF + WebP at 320/480/768/1200 widths into `public/media/p/<productId>/` (products), `c/<categorySlug>/` (categories), `h/<highlightId>/` (seminar highlights), `s/<storyId>/` (story photos), `a/<articleId>/` (article covers and inline Doc images) and `v/<videoId>/` (video posters), cached between CI runs by Drive `modifiedTime` (or URL for posters).
- Typed catalog access layer `src/lib/catalog/*` used by every page: products, categories, settings, delivery areas, seminars (including "next seminar" computed at runtime in Africa/Lagos), **highlights, videos, stories and articles** (client content from change 03).
- Video posters for YouTube and TikTok links downloaded at build (no third-party image hotlinking).
- A build-time compliance re-check of client-written text (defence in depth after the Sheet check).
- A realistic development fixture (clearly named Fixture products) for local work, tests and PR previews.
- Prerender page list grows automatically with products, categories and articles.

## Capabilities

### New Capabilities

- `catalog/data-pipeline`: how Sheet data becomes validated, static site data and optimised images.
- `catalog/access`: how pages read catalog data, including time-sensitive seminar selection.

## Impact

- Depends on 00 (scripts, generated folder) and 03 (live endpoint; the fixture is enough to start).
- New dev dependency: `sharp`.
- Used by 02 (footer, announcement), 05 (cart prices, delivery areas), 10–13, 18–21.

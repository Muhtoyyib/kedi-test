## Context

Contracts: Sheet columns and generated types in `docs/content-model.md`; endpoint in `docs/architecture.md` §7; pipeline in §4. The Apps Script already validates (change 03), but the build validates again because the build must never trust the network.

## Goals / Non-Goals

**Goals**

- Deterministic output: the same Sheet data gives byte-identical JSON (stable sort, no timestamps except `generatedAt`).
- Incremental images: unchanged images are not re-downloaded or re-encoded.
- Readable failures that name the tab, row and field.

**Non-Goals**

- Runtime fetching of the Sheet from the browser.
- Editing data from the site.

## Decisions

### 1. Modules

```
scripts/
├── fetch-catalog.ts              # CLI entry; reads env; orchestrates
└── lib/
    ├── parse-catalog.ts          # UntrustedValue → Catalog (pure, exhaustive tests)
    ├── slugify.ts                # name → slug (ascii fold, hyphenate, collapse)
    ├── image-pipeline.ts         # base64 → sharp variants; returns GeneratedImage
    ├── image-cache.ts            # .cache/images.json {key: {modifiedTime | url, outputs}}
    ├── resolve-content.ts        # Drive IDs / doc image refs / video URLs in client content → GeneratedImage, VideoRef
    ├── video-poster.ts           # YouTube thumbnail URL or TikTok oEmbed thumbnail → downloaded poster
    ├── compliance.ts             # banned health-claim words (shared list with apps-script/ and docs)
    └── fixtures/catalog.fixture.json
src/lib/catalog/
├── types.ts                      # interfaces from docs/content-model.md §2
├── data.ts                       # imports src/generated/catalog.json once; parses via parse-catalog in dev only
├── products.ts                   # getProducts(), getProductBySlug(), getFeaturedProducts(limit), getRelatedProducts(product, limit), getProductsByCategory(slug)
├── categories.ts                 # getCategories(), getCategory(slug)
├── settings.ts                   # getSettings(), getDeliveryAreas()
├── seminars.ts                   # getSeminars(), getNextSeminar(now), getPastSeminars(now)
├── highlights.ts                 # getHighlights(limit) — newest first
├── videos.ts                     # getVideos({topic?}) — newest first
├── stories.ts                    # getStories({featured?}) — featured first, then newest; getStory(id)
└── articles.ts                   # getArticles({topic?}), getArticle(slug), getRelatedArticles(article, n), getTopicsWithCounts()
```

`parse-catalog.ts` is shared by the build script (strict: throw on any error) and the Vitest fixtures.

### 1b. Client content resolution

- Highlight photos, story photos and article covers are Drive IDs → the same `?action=image` + sharp pipeline as products.
- Inline article images are `{doc, n}` refs → `?action=doc_image` → pipeline → the block becomes `{type:"image", image: GeneratedImage, alt}`. Cache key `doc:{docId}:{n}:{docLastUpdated}`.
- Video posters: YouTube → try `maxresdefault.jpg`, fall back to `hqdefault.jpg`; TikTok → `GET https://www.tiktok.com/oembed?url=…` → `thumbnail_url` → download. If a TikTok poster can't be fetched, use a branded placeholder (`scripts/fixtures/video-placeholder.png`: brand-soft with a play icon) and log a warning; the build still succeeds.
- Article slugs: `slug` column or `slugify(title)`; must be unique across articles (error otherwise). Heading IDs are unique within an article (`-2`, `-3` suffixes).
- Compliance re-check (`compliance.ts`) over article blocks (outside `doctor-callout`), story quotes and full stories, and highlight comments. A hit fails the build with the item ID and the word. The Apps Script check (change 03) normally catches these first.

### 2. Product ordering

`getProducts()`: `sortOrder` ascending, then name A–Z. `getFeaturedProducts(8)`: featured first by sortOrder; if fewer than 4 are featured, fill with in-stock products by sortOrder. Out-of-stock products sort after in-stock ones in grids, but keep their pages.

### 3. Related products

`relatedIds` if present (skipping inactive), else same category excluding self, then fill from other categories by sortOrder, up to 4.

### 4. Next seminar

`getNextSeminar(now)` = earliest seminar with status `scheduled` and `startsAt > now`. Prerender uses build time. Components that show it (home banner, seminars page) re-evaluate on the client after hydration with `Date.now()`. If the prerendered seminar has started, they switch to the next one or to the "no upcoming seminar" state. This handles stale HTML between nightly builds.

### 5. Image alt text

`{product name} — {pack size}` for the first image, `{product name} — image {n}` for the rest. Category image alt: `{category name}`.

### 6. Failure policy

| Condition                                   | Local dev                                                    | CI      |
| ------------------------------------------- | ------------------------------------------------------------ | ------- |
| Endpoint unreachable / non-200              | Fall back to the last generated catalog, with a loud warning | Fail    |
| Validation error                            | Fail with a list                                             | Fail    |
| One image fails to download                 | Use the previous cached image if present, else fail          | Same    |
| No products at all                          | Fail ("Catalog has no active products")                      | Fail    |
| No highlights / videos / stories / articles | Allowed (pages hide those sections)                          | Allowed |
| Video poster can't be fetched               | Placeholder poster + warning                                 | Same    |

## Risks / Trade-offs

- [`sharp` native binary on macOS arm64 and Linux CI] → Supported prebuilds for both; pin the version.
- [Large originals from phones (5–10 MB)] → The Apps Script size guard is 8 MB; the client is asked to upload ≤ 5 MB images.
- [Slug changes break shared links] → The parser warns when a product's slug differs from the previous `catalog.json`. Redirects are out of scope; `docs/content-model.md` tells the client to set slugs once.

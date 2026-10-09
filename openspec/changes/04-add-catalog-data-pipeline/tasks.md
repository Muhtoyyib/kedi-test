## 1. Parsing

- [ ] 1.1 `src/lib/catalog/types.ts` from `docs/content-model.md` §2
- [ ] 1.2 `scripts/lib/slugify.ts` + tests (accents, symbols, repeated hyphens, numbers)
- [ ] 1.3 `scripts/lib/parse-catalog.ts`: every field rule, defaulting (seo title/description, sort order 999), paragraph/line splitting, seminar date+time → ISO `+01:00` + tests for each rule and each error message format ("Products row 7 (KD-P007): price_ngn is not a number")
- [ ] 1.4 Replace the change-00 fixture with a realistic `catalog.fixture.json`: 9 fixture products across 4 categories (one out of stock, one ask-for-price, one with 3 images), 6 delivery areas, full settings, 3 seminars (one past, two future relative to a fixed date used in tests), 2 highlights (one with a clip and comment), 4 videos (YouTube, Shorts, TikTok), 4 stories (written, video, one without photo consent, one featured), 3 articles (one with every block type, including a doctor callout and an inline image) — every name prefixed "Fixture"
- [ ] 1.5 Parser rules for highlights, videos, stories and articles (types from `docs/content-model.md` §2) + tests

## 2. Images

- [ ] 2.1 `image-pipeline.ts` with sharp (AVIF q50, WebP q72, widths 320/480/768/1200, never upscale) + test using a small PNG
- [ ] 2.2 `image-cache.ts` keyed by Drive ID + modifiedTime + tests
- [ ] 2.3 Fixture mode uses images from `scripts/fixtures/images/` (simple generated packshot PNGs) through the same pipeline
- [ ] 2.4 `resolve-content.ts` (Drive IDs, doc image refs) + `video-poster.ts` (YouTube thumbnail fallback, TikTok oEmbed, placeholder on failure) + tests with mocked fetch
- [ ] 2.5 `compliance.ts` with the shared banned-word list + tests (doctor callout allowed; word-boundary matching; case-insensitive)

## 3. Fetch script

- [ ] 3.1 `scripts/fetch-catalog.ts` orchestrating fetch → parse → images → write, per the failure policy (design §6)
- [ ] 3.2 Slug-change warning against the previous `catalog.json`
- [ ] 3.3 `vite.config.ts` prerender list adds `/products/{slug}`, `/shop/{category}` and `/learn/{slug}` from the catalog

## 4. Access layer

- [ ] 4.1 `src/lib/catalog/{data,products,categories,settings,seminars,highlights,videos,stories,articles}.ts` per design §1–4
- [ ] 4.2 Tests: ordering, featured fill rule, related rule, `getNextSeminar` (before, during, after an event; cancelled skipped; WAT boundary), stories featured-first ordering, articles by topic, related articles, topic counts
- [ ] 4.3 `src/test-utils/fixtures.ts` exporting parsed fixture data for component tests

## 5. Verification

- [ ] 5.1 `CATALOG_SOURCE=fixture vp run catalog:fetch && vp run build` prerenders 9 product and 4 category pages (once those routes exist)
- [ ] 5.2 Against the test Apps Script: `vp run catalog:fetch` succeeds; re-running downloads no images
- [ ] 5.3 Break a row in the test Sheet → fetch fails with the row-specific message

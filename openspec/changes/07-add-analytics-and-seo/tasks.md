## 1. Analytics

- [ ] 1.1 `events.ts` typed union for every row in `docs/analytics-events.md` + test that parses the doc table and checks coverage
- [ ] 1.2 `track.ts` (consent gate, buffer, SSR no-op, Meta mapping) + tests
- [ ] 1.3 `loaders.ts` + route-change page views from the root; tests with consent false/true (no script tags before consent)
- [ ] 1.4 `attribution.ts` + tests (first touch per session, no UTMs → null)

## 2. SEO

- [ ] 2.1 `seo/meta.ts` `buildMeta` + tests (canonical without query, noindex, og type per kind)
- [ ] 2.2 Default OG image `public/og/default.jpg` (1200×630, brand blue, sun arc, wordmark, "Independent KEDI Distributor")
- [ ] 2.3 `seo/jsonld.ts` builders + tests validating required fields for each type (Product with/without price → Offer omitted when null; Event with physical vs online `eventAttendanceMode`)
- [ ] 2.4 Root head: Organization/LocalBusiness + WebSite JSON-LD
- [ ] 2.5 `/sitemap.xml` and `/robots.txt` routes + tests

## 3. Verification

- [ ] 3.1 Google Rich Results Test on a product page, the seminars page and the FAQ page (after those changes): no errors
- [ ] 3.2 DevTools: no analytics requests before consent; after Accept, GA4 `page_view` and Meta `PageView` fire; `add_to_cart` appears in GA4 DebugView
- [ ] 3.3 Document Search Console DNS verification and sitemap submission in `README.md`

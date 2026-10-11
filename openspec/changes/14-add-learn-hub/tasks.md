## 1. Pages

- [x] 1.1 Routes `learn.index.tsx` and `learn.$slug.tsx` with meta/JSON-LD; prerender list includes every catalog article
- [x] 1.2 Wire `getVideos` and `getArticles` from the catalog (empty lists allowed)
- [x] 1.3 Page tests: hub lists articles newest first; unknown slugs (including articles not marked Ready) → 404

## 2. Sections

- [x] 2.1 `sections/01-hub-header` complete
- [x] 2.2 `sections/02-topic-filter` complete
- [x] 2.3 `sections/03-article-grid` complete
- [x] 2.4 `sections/04-video-library` complete
- [x] 2.5 `sections/05-article-page` complete
- [x] 2.6 `sections/06-article-cta-block` complete

## 3. Verification

- [x] 3.1 `vp run lint`, `vp test --run`, `vp run build` pass; content lint passes
- [ ] 3.2 Rich Results Test: Article valid
- [ ] 3.3 Article page Lighthouse mobile ≥ 95 performance (text page, no third-party JS)

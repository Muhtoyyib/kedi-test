## Decisions

### Routes

- `src/routes/learn.index.tsx` → `LearnHubView`, `validateSearch` for `topic`.
- `src/routes/learn.$slug.tsx` → `loader` gets `getArticle(slug)` or `notFound()`.
- Prerender every article in the catalog (only Ready = Yes rows reach it).

### Meta

- Hub: "Wellness Hub: practical health habits | {Brand}"; description "Short, practical articles and videos on everyday wellness habits, from the {Brand} team in {City}."
- Article: `{title} | {Brand}`, `description` from the Articles row, `og:type article`, `og:image` cover 1200w, `article:published_time`. JSON-LD `Article` (headline, image, datePublished, author = Organization (the business), publisher = the business) + `BreadcrumbList`.

### Video data

Videos come from `getVideos({topic?})` (Sheet `Videos` tab). Posters are downloaded at build (change 04), so the page never loads images from YouTube or TikTok until a visitor taps play.

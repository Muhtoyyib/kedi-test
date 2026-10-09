## Layout

- Container `max-w-3xl` for text; the cover may be `max-w-5xl`.
- Breadcrumbs: Home › Learn › {Topic label} (topic links to `/learn?topic=`).
- Header: topic `Badge brand`, h1 `text-h1`, description `text-lead`, meta `text-sm text-text-muted` "By the [Brand Name] team · 1 October 2026 · 5 min read".
- Cover 16:9 `rounded-panel`, `priority`.
- Body: `Prose` (h2 `text-h2` with `scroll-mt-24`, h3, p 18px on md (`md:text-lead`), lists, blockquote with a `sun` left border, links `brand-strong` underlined, images `rounded-card` with captions).
- Body: `ArticleBody blocks={article.body}`. Videos appear where the client pasted the link in the Doc.
- "On this page" (`nav`, collapsible `details` on mobile) from `article.toc`, shown when there are 3+ h2s.
- The "When to see a doctor" section from the Doc renders as the `doctor-callout` block (`Notice tone="info"`) via `ArticleBody`.
- After the body: CTA block (section 06) → `Disclaimer kind="health"` → "Related products" link card (if `relatedCategory`: "Explore our {Category} range" → `/shop/{slug}`; secondary styling, no claims) → "More on {topic}" (`ArticleCard compact` ×3, excluding self; falls back to latest).

## Tracking

IntersectionObserver on a sentinel at 75% of the body → `article_read {slug, topic}` once.

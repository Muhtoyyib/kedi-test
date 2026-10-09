## Layout

- `SiteSection tone="canvas"`.
- Header: eyebrow "Wellness Hub", title "Learn something useful today", description "Short, practical reads on everyday wellness habits."
- Mobile: stacked list of compact cards (image 96×96 left, text right). md+: `grid-cols-3` with full cards.
- Footer link: `Button secondary` "Visit the Wellness Hub" → `/learn`.

## ArticleCard

- Full variant: 16:9 cover (`rounded-card`), topic badge (`Badge brand`, topic label), title `text-h3` (2-line clamp), description (2 lines, `text-text-body`), meta `text-sm text-text-muted` "5 min read · 1 Oct 2026". If the article has a video, a small `PlayCircle` icon precedes the meta.
- Compact variant: cover thumbnail 96×96, topic, title, meta.
- The whole card is one link (`<a>` wrapping, with the heading as its accessible name); `Card interactive`.

Topic labels: digestion → "Digestion", energy → "Energy", immunity → "Immunity", heart-and-circulation → "Heart & circulation", women → "Women's wellness", men → "Men's wellness", weight → "Weight", everyday-wellness → "Everyday wellness". Kept in `src/lib/content/topics.ts` (shared with change 14).

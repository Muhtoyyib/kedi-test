## Layout

- Mobile: single column. md: CSS columns (`md:columns-2 lg:columns-3 gap-6`, cards `break-inside-avoid mb-6`).
- Each card: `StoryCard` plus, if `fullStory` has paragraphs, the text via `RichText` in `Prose` (small), collapsed after 4 lines with "Read full story" (`details`/`summary`, works without JS).
- Each card has `id={slug}` and `scroll-mt-24`.

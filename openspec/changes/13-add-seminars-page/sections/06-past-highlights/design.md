## Layout

- `SiteSection tone="canvas"`, h2 "Past seminar highlights", description "A look at recent sessions."
- Up to 3 most recent highlights. Each: `h3` topic + date (`text-sm text-text-muted`); a photo grid (mobile: horizontal scroll of 4:3 photos at 80% width; md: 3-column grid, first photo spanning 2 rows); `VideoEmbed` (if clip); attendee comment `blockquote` (if present) styled like a mini `StoryCard`.
- "See more on Instagram" link button → `socials.instagram` (if set).
- Photos lazy-loaded; alt text from content.

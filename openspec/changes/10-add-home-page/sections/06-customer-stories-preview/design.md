## Layout

- `SiteSection tone="surface"`.
- Header: eyebrow "Customer stories", title "What our customers say about the service", align left; link button "Read more stories" (secondary) on the right at md+, below the cards on mobile.
- Mobile: horizontal scroll-snap row (`flex overflow-x-auto snap-x gap-4`, cards 85% width) with visible next-card peek. md+: `grid-cols-3 gap-6`.

## StoryCard

```
┌───────────────────────────────┐
│ “ (large quote mark, text-sun) │
│ The follow-up was excellent.  │   quote: text-lead text-ink, max 220 chars
│ I finally understood how to   │
│ use it.                       │
│                               │
│ (avatar 48) Ngozi A.          │   name: font-semibold text-ink
│             Ikeja             │   area: text-sm text-text-muted
│ [▶ Watch]  (video stories)    │
└───────────────────────────────┘
```

- `Card` p-6, `bg-canvas`. The avatar is the consented photo (`photo` in scope) or initials on `brand-soft` with `brand-strong` text.
- Video stories show a "Watch" link button opening `/stories#{slug}`.
- `<figure>` with `<blockquote>` and `<figcaption>`.

## Layout

- **Mobile:** `flex overflow-x-auto snap-x snap-mandatory` strip, each image 100% width, 1:1, `bg-brand-soft rounded-card`. Dots below (`8px` circles; active `bg-brand`, others `bg-line-strong`), updated by IntersectionObserver; dots are buttons `aria-label="Show image {n} of {total}"`.
- **md+:** main 1:1 image, with a thumbnail row under it (72px squares, `rounded-field`, active `ring-2 ring-brand`). Thumbnails are buttons that swap the main image.
- Badge overlay top-left: "Out of stock" when applicable.
- Tap/click on the main image → `ImageViewer` (Dialog, full screen, `bg-ink/95`) showing the 1200w image, with prev/next buttons, swipe, and close (Esc). Loaded lazily on first tap.

## Images

- First image: `priority` (LCP on this page). Others `loading="lazy"`.
- Single image: no dots or thumbnails.
- Alt text from the catalog (`{name} — {pack size}`, `{name} — image n`).

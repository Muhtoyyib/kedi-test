## ProductCard anatomy (full)

```
┌──────────────────────────┐
│ [image 1:1, bg-brand-soft│  ← link to /products/{slug}; badge top-left: "Out of stock" (out) or nothing
│  rounded-field]          │
│ DIGESTIVE HEALTH         │  ← category, text-eyebrow text-brand-strong
│ Product A                │  ← name, font-bold text-ink, 2-line clamp, link (stretched over image + name)
│ Short approved benefit…  │  ← shortBenefit, text-sm text-text-body, 2-line clamp (hidden in compact on <360px)
│ 60 capsules · Lasts      │  ← text-sm text-text-muted
│ about 4 weeks            │
│ ₦18,500                  │  ← Price (text-price) or "Ask for price"
│ [ + Add to cart ]        │  ← AddToCartButton variant="card" (or "Ask on WhatsApp" when out of stock)
└──────────────────────────┘
```

- `Card` with `p-3 md:p-4`, `flex flex-col` and the button pinned to the bottom (`mt-auto`), so the grid aligns.
- Link: the name `<a>` uses a stretched-link pattern (`after:absolute after:inset-0`) covering the image and text, but **not** the button (the button sits above it with `relative z-10`).
- Hover/focus-within: border `brand`; no lift.
- `compact` (mobile 2-col): `p-3`, name `text-base`, benefit hidden below 380px width, price `text-lg`.
- Image: `ResponsiveImage sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw"`; first 4 cards in a listing get `loading="eager"` (not priority).

## Grid

- `ul role="list"`: mobile `grid-cols-2 gap-3`, md `grid-cols-3 gap-6`, lg `grid-cols-4`.
- Each `li` contains one card.
- Tracking: `view_item_list` once per distinct filter result set when the grid is visible; `select_item` when a card link is tapped.

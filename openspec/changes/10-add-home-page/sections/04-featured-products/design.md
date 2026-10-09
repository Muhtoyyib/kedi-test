## Layout

- `SiteSection tone="brand-soft"`.
- Header row: `SectionHeader` (eyebrow "Shop", title "Featured products", description "Popular picks from our range. Not sure which suits you? Ask us.") on the left; on md+, a `Button secondary` "View all products" on the right (on mobile it moves below the grid, full width).
- **Category shortcuts** (between header and grid): a horizontal scroll row of chips linking to `/shop/{slug}` (each `rounded-full bg-canvas border border-line px-4 h-10 text-sm font-semibold text-ink`), max 6, then "All".
- Grid: mobile `grid-cols-2 gap-3` (compact card variant), md `grid-cols-3 gap-6`, lg `grid-cols-4`.
- Count: show 4 on mobile, up to 8 on md+. Mobile hides items 5–8 with `max-md:hidden`, so the HTML stays the same.

## Behaviour

- `ProductCard` handles add-to-cart (location `card`), out-of-stock and ask-price states.
- Track `view_item_list {item_list_id:"home_featured", items}` once when the grid enters the viewport (IntersectionObserver).
- If fewer than 1 product exists (empty catalog), the section is not rendered (prerender also fails earlier in change 04).

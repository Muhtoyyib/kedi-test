## Layout

- Sticky below the header (`sticky top-16 lg:top-[72px] z-30 bg-canvas/95 backdrop-blur border-b border-line`), `py-3`.
- `nav aria-label="Product categories"` containing a `ul` of links. Mobile: one row, `overflow-x-auto no-scrollbar snap-x`, with gradient fade edges (`after:` pseudo-element in `canvas`). md+: wraps to multiple rows if needed and stops being sticky (`md:static`).
- Chip: `h-10 px-4 rounded-full text-sm font-semibold border`. Default `bg-canvas border-line text-ink`. Current `bg-brand border-brand text-white` with `aria-current="page"`. Each chip shows a count `(n)` in `opacity-80`.
- On load, the active chip is scrolled into view (`scrollIntoView({inline:"center", block:"nearest"})`).

## Behaviour

- Links preserve `?q=` and `?sort=` when switching categories.
- Tracks `filter_category {category}` on click.

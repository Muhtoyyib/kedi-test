## Layout

- Row under the category filter: mobile stacks search (full width) then sort (full width); md+ search `flex-1` and sort `w-56` side by side. `py-4`.
- Search: `Input type="search"` with a leading `Search` icon, label visually hidden "Search products", placeholder "Search by product name", clear button (`X`, 40px) when non-empty. `enterkeyhint="search"`.
- Sort: `Select` with visible label "Sort" on md+ (visually hidden on mobile, where the select's first line reads "Sort: Recommended").
- Result line below (`text-sm text-text-muted`, `aria-live="polite"`): "Showing 6 of 24 products" (when filtered) or "24 products".

## Logic (`filter.ts`)

- Normalise: lowercase, strip accents, collapse spaces.
- Match: every whitespace-separated term must appear in `name + shortBenefit + categoryName + packSize` (AND match).
- Sort: `recommended` = catalog order (in stock first); `price-asc`/`price-desc` put ask-price items last; `name`.
- Debounce URL updates 300 ms (`replace` history). Debounce `search` analytics 800 ms, min 2 chars.

## No-JS

The input is in a `<form method="get" action="">`. Submitting without JS reloads the page with `?q=`, but static pages ignore it. The prerendered page always shows all products, which is acceptable.

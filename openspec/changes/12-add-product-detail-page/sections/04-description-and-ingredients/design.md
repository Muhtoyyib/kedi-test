## Layout

- `id="about"`, h2 `text-h2` "About this product".
- Paragraphs from `product.description[]` (`text-base`, `space-y-4`, max 65ch).
- If `ingredients.length > 0`: h3 "Key ingredients", then `ul` as a two-column list on md (`md:columns-2`), each item with a small `leaf` dot. The source line order is kept.
- If the description has more than 3 paragraphs on mobile, show the first 2 and a "Read more" toggle (`button`, `aria-expanded`). The full text is in the HTML (toggle uses CSS `line-clamp`/hidden class), so it is crawlable and works without JS (without JS everything shows).

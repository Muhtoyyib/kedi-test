## Layout

- `SiteSection tone="canvas"`. Grid: mobile 1 column; md 2; lg 3. `gap-6`.
- First 12 articles rendered; "Show more articles" `Button secondary` reveals 12 more (all are in the HTML for SEO; extra cards hidden with `hidden` until revealed, and visible without JS through a `<noscript>` style override).
- Empty (filter with no results cannot happen since only non-empty topics have chips; but if there are zero articles total): "Articles are coming soon. In the meantime, join our free seminar." + seminar link.

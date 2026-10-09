## Layout

- `max-w-3xl`. Breadcrumbs Home › {title}. h1 `text-h1`; "Last updated 1 October 2026" (`text-sm text-text-muted`).
- TOC: `nav aria-label="On this page"` in a `bg-surface rounded-card p-4` box, listing h2 headings (from the MDX TOC that fumadocs provides) as anchor links; collapsible (`details`) on mobile, open on md+.
- Body `Prose`. h2s get `scroll-mt-24` and anchor links.
- End: "Questions about this page? [Contact us](/contact) or email {email}."
- `@media print`: hide header, footer, floating button, cookie bar.

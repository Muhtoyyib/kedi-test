## Layout

- `max-w-3xl`, each group `section id={group}` with `scroll-mt-28`, h2 (group label), `Accordion` (`details name={group}`).
- Each item `details id={item.id}`; if the URL hash matches an item ID on load, that item opens and scrolls into view.
- Answer markdown: paragraphs, `**bold**`, `[link](/path)`; external links get `rel="noopener"`. Implemented with a small parser in `src/lib/content/mini-markdown.ts` (unit tested), not a full markdown library.
- A "Copy link" icon button per question (40px, `Link` icon, `aria-label="Copy link to this question"`), so the distributor can paste it into WhatsApp.

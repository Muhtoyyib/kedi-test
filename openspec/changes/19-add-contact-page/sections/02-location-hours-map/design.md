## Layout

md+: two columns (details left, map right). Mobile: details then map.

- Details: h2 "Visit us", address lines, hours (`Clock`), "Pick up your order or come to an in-person seminar.", `Button secondary` "Get directions" (`https://www.google.com/maps/search/?api=1&query={encoded mapsQuery}`, new tab).
- Map placeholder: `rounded-panel bg-brand-soft aspect-[4/3]` with `MapPin` icon, address text and `Button primary sm` "Show map". Tap → `<iframe src="https://www.google.com/maps?q={encoded}&output=embed" title="Map showing [Brand Name]" loading="lazy" referrerpolicy="no-referrer-when-downgrade">` (no API key needed).

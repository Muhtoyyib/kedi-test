## Layout

`SiteSection tone="surface"`. md+: two columns.

- Left: h2 "Where to find us", address (`MapPin`), hours (`Clock`), "Pick up your order from us or have it delivered.", `Button secondary sm` "Get directions" (Google Maps search URL from `address.mapsQuery`, new tab).
- Right: h3 "We deliver to", chips for each service area (`Badge neutral`), then "Interstate delivery by courier across Nigeria." and `link` "See delivery fees and times" → `/delivery-and-returns`.
- No embedded map here (it's on the Contact page) to keep the page light.

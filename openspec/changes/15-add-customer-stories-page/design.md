## Decisions

- Route `src/routes/stories.tsx`. Meta: "Customer stories | {Brand}"; description "What customers in {City} say about buying KEDI products from {Brand}: the guidance, follow-up and service."
- No `Review`/`AggregateRating` JSON-LD: Google treats self-serving reviews of a local business as ineligible, and ratings would invite claims. Plain content only.
- Each story gets an anchor `#{slug}` (deep links from the home page).
- If there are no stories at all, the page still renders sections 01 and 04 (with intro copy adjusted: "Our first stories are on the way").

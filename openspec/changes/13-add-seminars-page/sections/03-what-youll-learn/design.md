## Layout

- `SiteSection tone="surface"`. `SectionHeader` eyebrow "This week", title "What you'll learn".
- List: md `grid-cols-2`, each item a `Card` with a `CheckCircle2` icon in a 40px `leaf-soft` circle (`leaf-strong` icon) and the point text (`text-lead`).
- "At the end" `Notice tone="sun"` (only if `seminarOfferText`): title "At the end of the seminar", text "We teach first. If you'd like to try a product, there's a seminar-only offer: {seminarOfferText} There's no pressure to buy."
- If the next seminar has no learn points, show a generic list (exact):
  1. "Simple daily habits that support your wellbeing"
  2. "How to read and follow product usage instructions"
  3. "Answers to your questions, in plain language"

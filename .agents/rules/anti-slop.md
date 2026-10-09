---
trigger: always_on
description: Prevent placeholder-heavy, over-abstracted or misleading code.
---

# Anti-Slop Rules

- No lorem ipsum, "Hello world", stock "Lorem Health" copy, or invented testimonials. Copy comes from the section `design.md` or the client.
- Client values not yet supplied use the `[Placeholder]` form and live only in `src/lib/site-config.ts`, `content/` or the Sheet. They are listed in `docs/client-inputs.md`.
- Do not invent products, prices, NAFDAC numbers, reviews, ratings, stock counts or "X people bought this" social proof.
- Do not build an abstraction until a second real use exists. Three similar sections are fine.
- No unused helpers, dead files or "just in case" wrappers.
- No hover lift/scale/bounce on buttons, cards or icons. Colour/underline/border changes only.
- No carousels that auto-advance. No modals on page load (the cookie banner is a bar, not a modal).
- No fake urgency (countdown timers, "only 2 left") unless the data is real (seminar offer deadline from the Sheet is real).

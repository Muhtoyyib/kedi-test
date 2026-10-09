---
trigger: always_on
description: Testing standards.
---

# Testing

- Vitest for `src/lib/**` logic (order ID, order message, referral code, price/date formatting, catalog parser, cart reducer). Aim for full branch coverage there.
- Testing Library for each section component: renders required content from props, handles empty/missing data, fires the right analytics event, has accessible names.
- Test behaviour, not markup trivia. No snapshot tests.
- Fixture data comes from `src/test-utils/fixtures.ts` (built from the catalog fixture).
- Each page change ends with a manual mobile check at 360×640 and a Lighthouse mobile run (Performance ≥ 90, Accessibility ≥ 95, SEO = 100).

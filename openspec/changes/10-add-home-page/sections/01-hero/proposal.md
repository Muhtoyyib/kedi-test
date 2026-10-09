## Why

A visitor decides in about five seconds whether to stay. The hero must say who we are, where we are, why we are different, and offer the two main actions, with WhatsApp one tap away.

## What Changes

- Headline promise, supporting line, **Shop products** (primary), **Join this week's free seminar** (sun), a WhatsApp text link, a service-area line, and the distributor's photo with the sun-arc motif.
- The seminar button label adapts to the next seminar's timing.

Spec: `../../specs/home/hero/spec.md`

## Impact

- `src/features/home/components/hero.tsx`, `hero-seminar-label.ts` (pure).
- Client inputs: `[City]`, `[Area 1..3]`, the distributor hero photo (4:5 and 5:4 crops), `[Distributor Name]` (alt text).

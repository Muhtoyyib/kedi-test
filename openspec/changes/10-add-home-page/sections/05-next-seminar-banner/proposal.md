## Why

The weekly seminar is the main conversion channel (plan §5). The home page must show the next one with a one-tap Register, and never show a seminar that has already started.

## What Changes

- A blue panel with the next seminar's date block, topic, time, format/venue, a short summary and **Register free**, plus "See all seminars".
- Introduces the shared `SeminarCard` (used again by change 13).
- Empty state: "New seminar dates are coming soon" with "Get notified of every seminar" (Luma calendar).

Spec: `../../specs/home/next-seminar-banner/spec.md`

## Impact

- `src/components/marketing/seminar-card.tsx`, `src/features/home/components/next-seminar-banner.tsx`
- Data: `getNextSeminar(now)` evaluated at build and again on the client.
- Client inputs: Seminar Schedule rows, Luma calendar URL.

## Why

Photos and short clips from past seminars prove they're real, friendly and well attended.

## What Changes

- "Past seminar highlights": a photo grid per seminar (topic, date), optional video clip (facade), and an optional attendee comment (with consent). Hidden if there are no highlights.

Spec: `../../specs/seminars/past-highlights/spec.md`

## Impact

- `src/features/seminars/components/past-highlights.tsx`; data from `getHighlights(3)` (the Sheet's `Highlights` tab, change 04). The client adds a highlight by filling a row and pressing Publish.

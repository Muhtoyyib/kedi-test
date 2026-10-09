## Why

Real customers describing the service (not medical results) are strong trust signals for first-time buyers.

## What Changes

- Three featured stories as `StoryCard`s with a "Read more stories" link. The section is hidden when no stories are published.
- Introduces the shared `StoryCard` (reused by change 15).

Spec: `../../specs/home/customer-stories-preview/spec.md`

## Impact

- `src/components/marketing/story-card.tsx`, `src/features/home/components/stories-preview.tsx`
- Data: `getStories({featured: true}).slice(0, 3)`; falls back to the latest 3 if fewer than 3 are featured.
- Client input: at least 3 stories with written consent.

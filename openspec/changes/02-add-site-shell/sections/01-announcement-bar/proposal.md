## Why

The client sometimes needs to tell every visitor one thing ("Free seminar this Saturday", "Closed on Monday for the holiday") without a developer.

## What Changes

- A one-line bar above the header, shown only when `Settings.announcement_text` is set.
- An optional link (`Settings.announcement_link`) makes the whole bar tappable.
- A dismiss button hides it for that text for 7 days (stored in localStorage by a hash of the text).

Spec: `../../specs/site-shell/announcement-bar/spec.md`

## Impact

- `src/components/layout/site/announcement-bar.tsx`
- Reads `getSettings().announcement`.
- Client input: optional announcement text in the Sheet.

## Why

Luma handles registration, confirmation emails, reminders and check-in for free (plan §5.1). The registration questions (WhatsApp number, area, interest, source, consent) are configured in Luma. The site must embed it without slowing the page, and still capture interest if Luma can't load.

## What Changes

- `#register` section with a click-to-load Luma event embed, a direct "Open registration page" link, a "What happens next" list, and a fallback interest form (name, WhatsApp number, consent → `seminar_interest`) shown when the embed fails or no Luma event ID exists.

Spec: `../../specs/seminars/registration/spec.md`

## Impact

- `src/features/seminars/components/registration.tsx`, `luma-embed.tsx`, `seminar-interest-form.tsx`
- Requires `luma_event_id` and `luma_url` per Seminar Schedule row.

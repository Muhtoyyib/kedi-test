## Why

Some visitors prefer a form (e.g. on desktop, or for non-urgent questions). Submissions become leads in the Sheet.

## What Changes

- Form: name, WhatsApp number, email (optional), "How can we help?" topic (optional select), message, consent, honeypot → POST `contact` → `/thank-you/contact`.

Spec: `../../specs/contact/contact-form/spec.md`

## Impact

- `src/features/contact/components/contact-form.tsx`; uses `src/lib/forms/submit.ts`.

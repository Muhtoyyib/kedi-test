## Why

People attend for a person, not a brand. A short host bio and photo builds the personal trust the business is built on.

## What Changes

- Host card: photo, name, role ("Independent KEDI Distributor · [City]"), years of experience, short bio, and "Chat with [first name] on WhatsApp".

Spec: `../../specs/seminars/host/spec.md`

## Impact

- `src/features/seminars/components/host.tsx`; content from `content/about.ts` (`host`).
- Client inputs: host photo (1:1), a 60–90-word bio.

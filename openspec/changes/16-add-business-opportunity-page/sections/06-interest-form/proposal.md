## Why

The form captures prospective distributors into the Sheet (business_interest = Yes) for follow-up (plan §3.3: name, phone, location, current occupation).

## What Changes

- `#interest` form: Name, WhatsApp number, Location (city/area), Current occupation (optional select + other), "What would you like to know?" (optional), consent, honeypot → POST `business_interest` → `/thank-you/business`.

Spec: `../../specs/business/interest-form/spec.md`

## Impact

- `src/features/business/components/interest-form.tsx`; uses `src/lib/forms/submit.ts` (from change 13; build it here if 13 isn't merged).

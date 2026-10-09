## Why

Google Analytics, the Meta Pixel and Clarity set cookies and process personal data. Under the NDPA 2023 and the 2025 GAID, they should load only after the visitor agrees. Measurement still matters, so the bar must be clear and quick to answer, without blocking the page.

## What Changes

- A bottom bar (not a modal) with a one-sentence explanation, a privacy link, **Accept** and **Decline** buttons.
- The choice is stored for 6 months (`localStorage["consent"] = {analytics: boolean, at: ISO}`).
- A "Cookie settings" link in the footer reopens the bar.
- Exposes `getConsent()` / `onConsentChange()` from `src/lib/consent.ts` for change 07.

Spec: `../../specs/site-shell/cookie-consent/spec.md`

## Impact

- `src/lib/consent.ts`, `src/components/layout/site/cookie-consent.tsx`, footer link.

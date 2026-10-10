## 1. Build

- [x] 1.1 `src/lib/consent.ts`: `getConsent(storage, now)`, `setConsent`, `clearConsent`, `onConsentChange(cb)`, `clearAnalyticsCookies(document)` + unit tests (expiry at 182 days, corrupt storage value treated as no choice)
- [x] 1.2 `CookieConsent` component per design + "Cookie settings" footer link
- [x] 1.3 Tests: shows when no choice; Accept stores true and hides; Decline stores false; footer link reopens; expired choice asks again

## 2. Verify

- [ ] 2.1 With DevTools Network: before choosing, no requests to googletagmanager.com, connect.facebook.net or clarity.ms (once change 07 is merged)

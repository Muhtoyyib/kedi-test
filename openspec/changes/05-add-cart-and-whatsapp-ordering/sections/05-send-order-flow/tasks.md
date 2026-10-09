## 1. Build

- [ ] 1.1 `order-id.ts` + tests (format, Lagos date at 23:30 UTC = next day, alphabet excludes ambiguous chars) + property test
- [ ] 1.2 `messages.ts` `orderMessage` + tests: priced lines, ask-price lines, no referral line, Other area, exact snapshot of the doc example (string equality, not a DOM snapshot)
- [ ] 1.3 `link.ts` `buildWhatsAppLink` (+ length check: throws in dev over 2,000 chars) + tests
- [ ] 1.4 `payload.ts` + tests (subtotal, hasAskPrice, trimmed strings, normalised phone)
- [ ] 1.5 `beacon.ts` + tests (sendBeacon true → "queued"; false → fetch keepalive; both throw → "unavailable"; no URL → "unavailable")
- [ ] 1.6 `pending.ts` (sessionStorage) + tests
- [ ] 1.7 `SendOrderButton` per design + tests: validation stops send; on success calls beacon, tracks the event, sets `location.href` (mocked) to the expected link; desktop uses `window.open`

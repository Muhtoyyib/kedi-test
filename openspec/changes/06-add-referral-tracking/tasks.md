## 1. Build

- [x] 1.1 `code.ts`: `createReferralCode(firstName, phone)`, `normalizeReferralCode(input)`, `isValidReferralCode` + tests (accents, short names, non-Latin, trailing letter, lowercase input) + fast-check property: the output always matches the pattern
- [x] 1.2 `capture.ts`: `captureReferralFromUrl(location, storage, history, now)`, `getStoredReferralCode(storage, now)` + tests (valid, invalid ignored, override, 30-day expiry, other params preserved)
- [x] 1.3 `register.ts` + tests (body shape, one retry)
- [x] 1.4 `link.ts`: `buildReferralLink(code)`, `referralShareMessage(code, friendReward)` (text per `docs/whatsapp-messages.md` §8) + tests
- [x] 1.5 Call `captureReferralFromUrl` once from the root component after hydration

## 2. Verification

- [ ] 2.1 Open `/?ref=amaka-4821&utm_source=ig` → the address bar shows `/?utm_source=ig`; the cart field shows AMAKA-4821 Applied
- [x] 2.2 `vp run lint`, `vp test --run` pass

## Context

Plan §3.6. The Apps Script flags collisions (change 03). No accounts and no server-side lookup: the code is self-describing.

## Decisions

### Code format

`code = NAME + "-" + last4`, where:

- `NAME` = first name → strip accents (NFD, remove marks) → keep A–Z only → uppercase → first 12 letters. If fewer than 2 letters remain (e.g. a non-Latin name), use `FRIEND`.
- `last4` = last 4 digits of the normalised phone.
- Example: "Amaka" + 0803 123 4821 → `AMAKA-4821`; "Chukwuemeka" → `CHUKWUEMEKA-…`; "Ọlá" → `OLA-…`.
- Accepted pattern when typed or read from a URL: `^[A-Z]{2,12}-\d{4}[A-Z]?$` (case-insensitive input, stored uppercase). The optional trailing letter is the distributor's manual disambiguation (`AMAKA-4821B`).

### Link

`{siteUrl}/?ref={code}`. Any page accepts `ref`, so the client can also share deep links (`/products/x?ref=…`).

### Capture

On hydration (root effect):

1. Read `ref` from `location.search`; if valid, store `localStorage["ref:v1"] = {code, at}` (a newer link overrides an older one); track `referral_landing`.
2. `history.replaceState` to remove `ref` (keeping other params), so shared URLs and analytics stay clean.
3. `getStoredReferralCode(now)` returns the code if it is ≤ 30 days old, otherwise null (and clears it).

### Registration

`registerReferralCode({firstName, phone, code})` → `fetch(APPS_SCRIPT_URL, {method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body})`. The page does not block on it; on failure it retries once after 3 s. Duplicate registration is harmless (the Apps Script no-ops).

## Risks / Trade-offs

- [Codes reveal the last 4 phone digits] → Acceptable and common; the full number is never exposed. Documented on the Refer page ("Your code uses your first name and the last 4 digits of your number").
- [Someone types another person's code for themselves] → The reward goes to the code's registered referrer only after the friend's first paid order, confirmed by the distributor.

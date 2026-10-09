## Why

Referrals are the cheapest growth channel in the plan (§3.6, §6.5). Customers need a personal code and link without accounts, and a friend who opens the link must have the code applied automatically, without any server beyond the existing Apps Script.

## What Changes

- `src/lib/referral/code.ts`: deterministic code from first name + last 4 phone digits (`AMAKA-4821`), with normalisation rules.
- `src/lib/referral/capture.ts`: reads `?ref=` on any page, validates it, stores it for 30 days, removes it from the address bar, and tracks `referral_landing`.
- `src/lib/referral/register.ts`: posts `{type:"referral_code"}` to the Apps Script (fire-and-forget fetch; the result is not required).
- `getStoredReferralCode()` for the cart (change 05) and `buildReferralLink(code)` / `referralShareMessage()` for the Refer page (change 20).

## Capabilities

### New Capabilities

- `referrals/code-generation`: how personal codes and links are formed.
- `referrals/link-capture`: how a referral link is remembered and applied.

## Impact

- Depends on 00, 03 (registration endpoint), 05 (cart reads the stored code).
- The UI lives in change 20 (Refer page) and change 05 (cart field).

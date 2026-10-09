## Why

Happy customers are the cheapest source of new customers. The page explains the reward and gives each customer a personal code and link instantly, with no account (plan §3.3 page 11, §3.6, §6.4).

## What Changes

`/refer` → `src/features/refer/view.tsx`:

| #   | Folder                       | Section                                                        |
| --- | ---------------------------- | -------------------------------------------------------------- |
| 1   | `sections/01-hero-reward`    | The Give & Get reward from Settings                            |
| 2   | `sections/02-how-it-works`   | Three steps                                                    |
| 3   | `sections/03-get-your-code`  | First name + phone → code and link (registers via Apps Script) |
| 4   | `sections/04-share-panel`    | WhatsApp share, copy link, copy code, native share             |
| 5   | `sections/05-referral-terms` | Plain-language terms and loyalty note                          |

## Capabilities

### New Capabilities

- `refer/page`, `refer/hero-reward`, `refer/how-it-works`, `refer/get-your-code`, `refer/share-panel`, `refer/referral-terms`.

## Impact

- Depends on 01, 02, 03 (`referral_code` intake), 04 (reward settings), 06 (code, link, register, share message).
- Client inputs: `referral_reward_text`, `referral_friend_reward_text`, `loyalty_text` in Settings.

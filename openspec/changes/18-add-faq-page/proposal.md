## Why

Answering the same questions on WhatsApp all day doesn't scale. The FAQ answers the plan's list (§3.3 page 9): genuine products, ordering, payment, delivery, returns, seminars, becoming a distributor, plus referrals.

## What Changes

`/faq` → `src/features/faq/view.tsx`:

| #   | Folder                             | Section                                          |
| --- | ---------------------------------- | ------------------------------------------------ |
| 1   | `sections/01-faq-header`           | h1, intro, jump links to groups                  |
| 2   | `sections/02-faq-groups`           | Grouped accordions with live settings in answers |
| 3   | `sections/03-still-have-questions` | WhatsApp, call and contact options               |

## Capabilities

### New Capabilities

- `faq/page`, `faq/faq-header`, `faq/faq-groups`, `faq/still-have-questions`.

## Impact

- Depends on 01, 02, 04 (settings tokens), 07 (FAQPage JSON-LD), 08 (`content/faq.ts`).
- Client inputs: bank details, delivery details, returns policy, referral rewards (all through the Sheet/settings or legal content).

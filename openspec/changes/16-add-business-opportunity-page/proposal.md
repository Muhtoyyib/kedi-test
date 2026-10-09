## Why

The distributor grows by recruiting new distributors into their team (plan §3.3 page 7). The page must capture interested people while making no income guarantees or exaggerated earnings claims (§10.3), which also protects ad accounts.

## What Changes

`/business-opportunity` → `src/features/business/view.tsx`:

| #   | Folder                                 | Section                                                          |
| --- | -------------------------------------- | ---------------------------------------------------------------- |
| 1   | `sections/01-hero`                     | Honest headline, intro, "Register your interest" + seminar link  |
| 2   | `sections/02-what-it-is`               | What being a KEDI distributor means                              |
| 3   | `sections/03-how-it-works`             | Steps from interest to getting started                           |
| 4   | `sections/04-support-we-provide`       | Training, seminars, product knowledge, mentoring                 |
| 5   | `sections/05-seminar-business-segment` | Invitation to the business segment of the weekly seminar         |
| 6   | `sections/06-interest-form`            | Name, phone, location, occupation, consent → `business_interest` |
| 7   | `sections/07-earnings-disclaimer`      | The exact earnings disclaimer                                    |
| 8   | `sections/08-faq`                      | Business FAQs                                                    |

## Capabilities

### New Capabilities

- `business/page`, `business/hero`, `business/what-it-is`, `business/how-it-works`, `business/support-we-provide`, `business/seminar-business-segment`, `business/interest-form`, `business/earnings-disclaimer`, `business/faq`.

## Impact

- Depends on 01, 02, 03 (`business_interest` intake), 04 (next seminar), 08 (`content/business.ts`, FAQs).
- Client inputs: how KEDI's distributor programme works (registration steps, starter requirements) in KEDI-approved wording; the support the distributor offers.

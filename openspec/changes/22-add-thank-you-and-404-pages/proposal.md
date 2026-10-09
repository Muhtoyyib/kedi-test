## Why

After a form is submitted, visitors need confirmation and a next step, and analytics need a reliable conversion page (plan §3.3 page 13). Broken links need a helpful 404 that keeps people on the site.

## What Changes

| #   | Folder                           | Route                                                      |
| --- | -------------------------------- | ---------------------------------------------------------- |
| 1   | `sections/01-thank-you-template` | Shared thank-you layout                                    |
| 2   | `sections/02-thank-you-variants` | `/thank-you/contact`, `/business`, `/referral`, `/seminar` |
| 3   | `sections/03-not-found`          | 404 page                                                   |

## Capabilities

### New Capabilities

- `system-pages/thank-you-template`, `system-pages/thank-you-variants`, `system-pages/not-found`.

## Impact

- Depends on 01, 02, 07 (noindex meta).
- The forms in 13, 16, 19 and 20 navigate here.

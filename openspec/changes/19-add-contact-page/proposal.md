## Why

The contact page must make every channel obvious (WhatsApp first), show where the business is, offer a simple form for people who prefer it, and warn customers about payment impersonators (plan §3.3 page 10, §7).

## What Changes

`/contact` → `src/features/contact/view.tsx`:

| #   | Folder                              | Section                                                     |
| --- | ----------------------------------- | ----------------------------------------------------------- |
| 1   | `sections/01-contact-methods`       | WhatsApp, call, email, socials                              |
| 2   | `sections/02-location-hours-map`    | Address, hours, click-to-load Google Map, directions        |
| 3   | `sections/03-contact-form`          | Name, phone, email (optional), message, consent → `contact` |
| 4   | `sections/04-payment-safety-notice` | Official account details and the impersonation warning      |

## Capabilities

### New Capabilities

- `contact/page`, `contact/contact-methods`, `contact/location-hours-map`, `contact/contact-form`, `contact/payment-safety`.

## Impact

- Depends on 01, 02, 03 (`contact` intake), 04 (settings: hours, bank).
- Client inputs: phone, email, address, maps query, bank details, socials.

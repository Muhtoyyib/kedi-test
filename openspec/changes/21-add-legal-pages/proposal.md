## Why

The plan requires a Privacy Policy (NDPA 2023), Terms of Use, Health Disclaimer and Delivery & Returns policy (§3.3 page 12). They protect the business and answer real customer questions (delivery fees, returns).

## What Changes

Four MDX pages in `content/legal/` rendered by one layout:

| #   | Folder                             | Route                                                                   |
| --- | ---------------------------------- | ----------------------------------------------------------------------- |
| 1   | `sections/01-legal-layout`         | Shared layout: title, updated date, table of contents, print-friendly   |
| 2   | `sections/02-privacy-policy`       | `/privacy`                                                              |
| 3   | `sections/03-terms-of-use`         | `/terms`                                                                |
| 4   | `sections/04-health-disclaimer`    | `/health-disclaimer`                                                    |
| 5   | `sections/05-delivery-and-returns` | `/delivery-and-returns` (with the live delivery table and bank details) |

**These drafts must be reviewed by the client, and ideally by a Nigerian lawyer, before launch.** The specs define structure and minimum content, not legal advice.

## Capabilities

### New Capabilities

- `legal/layout`, `legal/privacy-policy`, `legal/terms-of-use`, `legal/health-disclaimer`, `legal/delivery-and-returns`.

## Impact

- Depends on 01, 02, 04 (delivery table, bank details), 08 (legal collection, MDX components), 19 (`BankDetails`).
- Client inputs: registered business name and address, returns decisions, governing state, data contact email.

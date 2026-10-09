## Why

Most visitors land on the home page from a social bio link. It must build trust in five seconds and send every visitor to one of three actions: **Shop**, **Register for the seminar**, or **Chat on WhatsApp** (plan §3.3, page 1).

## What Changes

Replace the holding page at `/` with `src/features/home/view.tsx`, composed of eight sections in this order:

| #   | Folder                                 | Section                                                                     | Tone                |
| --- | -------------------------------------- | --------------------------------------------------------------------------- | ------------------- |
| 1   | `sections/01-hero`                     | Promise, two primary actions, WhatsApp link, distributor photo with sun arc | canvas              |
| 2   | `sections/02-trust-bar`                | Four trust points                                                           | surface             |
| 3   | `sections/03-why-buy-from-us`          | Five differentiators                                                        | canvas              |
| 4   | `sections/04-featured-products`        | 4–8 featured product cards                                                  | brand-soft          |
| 5   | `sections/05-next-seminar-banner`      | Next free seminar with Register                                             | canvas (blue panel) |
| 6   | `sections/06-customer-stories-preview` | Three featured stories (hidden if none)                                     | surface             |
| 7   | `sections/07-wellness-hub-preview`     | Three latest articles (hidden if none)                                      | canvas              |
| 8   | `sections/08-final-cta`                | "Not sure what you need?" WhatsApp band                                     | canvas (ink panel)  |

The floating WhatsApp button comes from the shell (change 02).

## Capabilities

### New Capabilities

- `home/page`: route, metadata and section order.
- `home/hero`, `home/trust-bar`, `home/why-buy-from-us`, `home/featured-products`, `home/next-seminar-banner`, `home/customer-stories-preview`, `home/wellness-hub-preview`, `home/final-cta`: one per section.

## Impact

- Depends on 01, 02, 04, 05 (add to cart), 07 (meta, JSON-LD), 04 (stories and articles from the Sheet), and `ProductCard` from `11-add-shop-page/sections/04-product-grid-and-card`.
- Introduces shared cards used by later pages: `SeminarCard` (section 05; reused by 13), `StoryCard` (section 06; reused by 15), `ArticleCard` (section 07; reused by 14).
- Client inputs: brand name, city, service areas, distributor hero photo, featured products, at least 3 stories with consent, seminar schedule.

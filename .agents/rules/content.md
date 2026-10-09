---
trigger: always_on
description: Where content lives and how it flows.
---

# Content Rules

| Content                                        | Source of truth                                                               | Edited by                                                     |
| ---------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Products, categories, prices, stock, images    | Sheet `Products`, `Categories`, `Product FAQs` → `src/generated/catalog.json` | Client                                                        |
| Delivery fees, bank details, hours, offer text | Sheet `Settings` and `Delivery`                                               | Client                                                        |
| Seminar schedule                               | Sheet `Seminar Schedule`                                                      | Client                                                        |
| Seminar highlights                             | Sheet `Highlights` + Drive photos                                             | Client                                                        |
| Videos (Learn)                                 | Sheet `Videos`                                                                | Client                                                        |
| Customer stories                               | Sheet `Stories` (consent columns required)                                    | Client                                                        |
| Articles (Learn)                               | Google Docs in the "Website Articles" folder + Sheet `Articles`               | Client (we may draft; client approves by setting Ready = Yes) |
| Brand, phone, socials, URLs                    | `src/lib/site-config.ts`                                                      | Developer                                                     |
| FAQs                                           | `content/faq.ts`                                                              | Developer                                                     |
| About/host, business opportunity copy          | `content/about.ts`, `content/business.ts`                                     | Developer from client text                                    |
| Legal pages                                    | `content/legal/*.mdx`                                                         | Developer, reviewed by client                                 |

- `src/generated/` is never edited by hand and is git-ignored; `vp run catalog:fetch` writes it.
- The fixture `scripts/fixtures/catalog.fixture.json` is for development and tests only. Production builds fail if the catalog came from the fixture.
- Client content is untrusted input: render article blocks through the typed renderer only (never raw HTML), and keep the compliance check in the build.
- New `.mdx` legal files need a dev-server restart to get a route (same as Rixl).

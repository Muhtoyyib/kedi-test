# Build Order

Apply changes in this order. Changes in the same row can be built in parallel by different agents once their dependencies are archived or merged.

| Step | Change                                                                                                                              | Depends on                                                                                 | Sections          |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------- |
| 1    | `00-setup-project-foundation`                                                                                                       | —                                                                                          | —                 |
| 2    | `01-add-design-system`                                                                                                              | 00                                                                                         | —                 |
| 3    | `03-add-apps-script-backend` · `04-add-catalog-data-pipeline`                                                                       | 00 (04 also needs 03's catalog endpoint, or the fixture)                                   | —                 |
| 4    | `02-add-site-shell` · `07-add-analytics-and-seo` · `08-add-content-collections`                                                     | 01 (02 also uses 04's settings)                                                            | 02 has 6 sections |
| 5    | `05-add-cart-and-whatsapp-ordering` · `06-add-referral-tracking`                                                                    | 01, 02, 03, 04                                                                             | 05 has 6 sections |
| 6a   | `11-add-shop-page` (build `sections/04-product-grid-and-card` first: `ProductCard` is shared)                                       | 02, 04, 05, 07                                                                             | 7                 |
| 6b   | `10-add-home-page` · `12-add-product-detail-page`                                                                                   | 11's `ProductCard`                                                                         | 8 · 10            |
| 7    | `13-add-seminars-page` · `14-add-learn-hub` · `15-add-customer-stories-page`                                                        | 02, 04, 07, 08, and the cards introduced by 10 (`SeminarCard`, `ArticleCard`, `StoryCard`) | 7 · 6 · 4         |
| 8    | `16-add-business-opportunity-page` · `17-add-about-page` · `18-add-faq-page` · `19-add-contact-page` · `20-add-refer-a-friend-page` | 02, 03 (forms), 06 (refer), 08                                                             | 8 · 5 · 3 · 4 · 5 |
| 9    | `21-add-legal-pages` · `22-add-thank-you-and-404-pages`                                                                             | 02, 08                                                                                     | 5 · 3             |

## Shared components and where they are born

| Component                            | Built in                                                                            | Reused by  |
| ------------------------------------ | ----------------------------------------------------------------------------------- | ---------- |
| `ProductCard`                        | `11/sections/04-product-grid-and-card`                                              | 10, 12     |
| `SeminarCard`                        | `10/sections/05-next-seminar-banner`                                                | 13         |
| `StoryCard`                          | `10/sections/06-customer-stories-preview`                                           | 15         |
| `ArticleCard`                        | `10/sections/07-wellness-hub-preview`                                               | 14         |
| `AddToCartButton`, `QuantityStepper` | `05/sections/02-add-to-cart-controls`                                               | 10, 11, 12 |
| `src/lib/forms/submit.ts`            | `13/sections/02-luma-registration` (or whichever form ships first)                  | 16, 19, 20 |
| `src/lib/whatsapp/*`                 | `02/sections/02-header` or `05/sections/05-send-order-flow` (whichever ships first) | all        |
| `PaymentSafety` / `BankDetails`      | `19/sections/04-payment-safety-notice`                                              | 21         |

If a section needs a shared component that doesn't exist yet, build it in the change listed here (following that section's spec), not in a local copy.

## Working on one section

1. Read `AGENTS.md` and `.agents/rules/*`.
2. Read the page change: `openspec/changes/<page>/proposal.md` and `design.md`.
3. Read the section: `sections/NN-<name>/proposal.md` → `specs/<page>/<section>/spec.md` → `sections/NN-<name>/design.md`.
4. Do `sections/NN-<name>/tasks.md` in order, ticking each box.
5. Tick the section's box in the page's `tasks.md`.
6. When every box in a change is ticked and verified: `openspec validate <change> --strict`, then `openspec archive <change>`.

## Definition of done (every section)

- Matches its spec scenarios (each scenario has a test, or a manual check noted in tasks).
- Uses only design-system tokens and primitives.
- Renders correctly at 360, 768 and 1280px wide.
- Works with keyboard only; has visible focus; images have alt text.
- No console errors; `vp run lint`, `vp test --run` and `vp run build` pass.

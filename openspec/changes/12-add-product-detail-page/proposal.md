## Why

The product page is where a buyer decides. It must show approved information only (plan §3.3 page 3, §10), make ordering or asking on WhatsApp effortless, state how long a pack lasts (it drives reorders), and carry the health disclaimer.

## What Changes

`/products/$slug` → `src/features/product-detail/view.tsx`:

| #   | Folder                                    | Section                                                                                | Position                   |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------- |
| 1   | `sections/01-breadcrumbs`                 | Home › Shop › Category › Product                                                       | top                        |
| 2   | `sections/02-image-gallery`               | Main image + thumbnails, swipe on mobile                                               | left column (md+)          |
| 3   | `sections/03-purchase-panel`              | Name, benefit, pack, price, stock, quantity, Add to cart, Ask on WhatsApp, trust lines | right column (md+), sticky |
| 4   | `sections/04-description-and-ingredients` | Approved description and key ingredients                                               | below                      |
| 5   | `sections/05-how-to-use`                  | Approved usage steps                                                                   | below                      |
| 6   | `sections/06-product-facts`               | NAFDAC no., pack size, how long it lasts, category, product code                       | below                      |
| 7   | `sections/07-product-faqs`                | Product FAQs from the Sheet + general ordering FAQs                                    | below                      |
| 8   | `sections/08-related-products`            | Up to 4 related product cards                                                          | below                      |
| 9   | `sections/09-health-disclaimer`           | Full health disclaimer                                                                 | end of main                |
| 10  | `sections/10-mobile-sticky-buy-bar`       | Price + Add to cart + WhatsApp bar on phones                                           | fixed bottom (< md)        |

## Capabilities

### New Capabilities

- `product-detail/page` and one capability per section: `product-detail/breadcrumbs`, `product-detail/image-gallery`, `product-detail/purchase-panel`, `product-detail/description-and-ingredients`, `product-detail/how-to-use`, `product-detail/product-facts`, `product-detail/product-faqs`, `product-detail/related-products`, `product-detail/health-disclaimer`, `product-detail/sticky-buy-bar`.

## Impact

- Depends on 01, 02 (`hideFloatingWhatsApp`), 04, 05, 07 (Product JSON-LD), 11 (`ProductCard`).
- Client inputs: all approved product fields, images, NAFDAC numbers, product FAQs.

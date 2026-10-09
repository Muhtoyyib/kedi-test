# Routes and Sitemap

Every route is prerendered to static HTML. "Change" is the OpenSpec change that builds it.

| Route                   | Route file                                                 | Feature folder            | Change                             | Sitemap priority    |
| ----------------------- | ---------------------------------------------------------- | ------------------------- | ---------------------------------- | ------------------- |
| `/`                     | `src/routes/index.tsx`                                     | `features/home`           | `10-add-home-page`                 | 1.0                 |
| `/shop`                 | `src/routes/shop.index.tsx`                                | `features/shop`           | `11-add-shop-page`                 | 0.9                 |
| `/shop/$category`       | `src/routes/shop.$category.tsx`                            | `features/shop`           | `11-add-shop-page`                 | 0.8                 |
| `/products/$slug`       | `src/routes/products.$slug.tsx`                            | `features/product-detail` | `12-add-product-detail-page`       | 0.8                 |
| `/seminars`             | `src/routes/seminars.tsx`                                  | `features/seminars`       | `13-add-seminars-page`             | 0.9                 |
| `/learn`                | `src/routes/learn.index.tsx`                               | `features/learn`          | `14-add-learn-hub`                 | 0.7                 |
| `/learn/$slug`          | `src/routes/learn.$slug.tsx`                               | `features/learn`          | `14-add-learn-hub`                 | 0.6                 |
| `/stories`              | `src/routes/stories.tsx`                                   | `features/stories`        | `15-add-customer-stories-page`     | 0.6                 |
| `/business-opportunity` | `src/routes/business-opportunity.tsx`                      | `features/business`       | `16-add-business-opportunity-page` | 0.6                 |
| `/about`                | `src/routes/about.tsx`                                     | `features/about`          | `17-add-about-page`                | 0.6                 |
| `/faq`                  | `src/routes/faq.tsx`                                       | `features/faq`            | `18-add-faq-page`                  | 0.6                 |
| `/contact`              | `src/routes/contact.tsx`                                   | `features/contact`        | `19-add-contact-page`              | 0.7                 |
| `/refer`                | `src/routes/refer.tsx`                                     | `features/refer`          | `20-add-refer-a-friend-page`       | 0.5                 |
| `/privacy`              | `src/routes/privacy.tsx`                                   | `features/legal`          | `21-add-legal-pages`               | 0.3                 |
| `/terms`                | `src/routes/terms.tsx`                                     | `features/legal`          | `21-add-legal-pages`               | 0.3                 |
| `/health-disclaimer`    | `src/routes/health-disclaimer.tsx`                         | `features/legal`          | `21-add-legal-pages`               | 0.3                 |
| `/delivery-and-returns` | `src/routes/delivery-and-returns.tsx`                      | `features/legal`          | `21-add-legal-pages`               | 0.4                 |
| `/thank-you/$kind`      | `src/routes/thank-you.$kind.tsx`                           | `features/thank-you`      | `22-add-thank-you-and-404-pages`   | excluded, `noindex` |
| 404                     | router `defaultNotFoundComponent` → `dist/client/404.html` | `features/not-found`      | `22-add-thank-you-and-404-pages`   | excluded            |
| `/sitemap.xml`          | `src/routes/sitemap[.]xml.ts`                              | —                         | `07-add-analytics-and-seo`         | —                   |
| `/robots.txt`           | `src/routes/robots[.]txt.ts`                               | —                         | `07-add-analytics-and-seo`         | —                   |

`$kind` ∈ `contact`, `business`, `referral`, `seminar`.

## Query parameters the site understands

| Param                                      | Where    | Effect                                                                |
| ------------------------------------------ | -------- | --------------------------------------------------------------------- |
| `ref`                                      | any page | Stores a referral code for 30 days (change `06`)                      |
| `utm_source`, `utm_medium`, `utm_campaign` | any page | Stored for the session and attached to orders and forms (change `07`) |
| `q`                                        | `/shop`  | Search term (change `11`)                                             |
| `topic`                                    | `/learn` | Topic filter (change `14`)                                            |
| `cart=open`                                | any page | Opens the cart drawer (used by "Return to your order" links)          |

## Primary navigation

Desktop header: **Shop**, **Seminars**, **Learn**, **Stories**, **About**, then **Contact** as a text link, a cart button, and the **Chat on WhatsApp** button.

Mobile menu: Shop, Seminars, Learn, Customer stories, Business opportunity, Refer a friend, About us, FAQ, Contact, followed by a WhatsApp button and the opening hours.

Footer columns: **Shop** (categories), **Learn & events** (Seminars, Learn, Stories), **Company** (About, Business opportunity, Refer a friend, FAQ, Contact), **Legal** (Privacy, Terms, Health disclaimer, Delivery & returns).

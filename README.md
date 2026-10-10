# [Brand Name] website

Website for an independent KEDI Healthcare distributor: product catalogue with WhatsApp ordering, weekly seminar registration, wellness articles and referral links. Static site on Cloudflare, data in Google Sheets.

- Start here: `AGENTS.md`
- Order of work: `docs/build-order.md`
- Specs: `openspec/changes/`
- Business plan: `../KEDI_Digital_Sales_System_Implementation_Plan.md`
- Costs: `../KEDI_Running_Costs_and_Payments.md`

## GitHub secrets and variables

Required in **Settings → Secrets and variables → Actions** before CI deploys work:

| Secret                  | Used by                                 |
| ----------------------- | --------------------------------------- |
| `APPS_SCRIPT_URL`       | catalog fetch, publish-result reporting |
| `CATALOG_READ_TOKEN`    | catalog/image read auth                 |
| `CLOUDFLARE_API_TOKEN`  | wrangler deploy / versions upload       |
| `CLOUDFLARE_ACCOUNT_ID` | wrangler deploy                         |

| Variable                                                 | Used by                                    |
| -------------------------------------------------------- | ------------------------------------------ |
| `VITE_SITE_URL`                                          | canonical links, sitemap, production guard |
| `VITE_APPS_SCRIPT_URL`                                   | order/form endpoint inlined at build       |
| `VITE_GA4_ID` · `VITE_META_PIXEL_ID` · `VITE_CLARITY_ID` | analytics (optional; empty = disabled)     |

## Search Console (after go-live)

1. In [Google Search Console](https://search.google.com/search-console) add the production domain as a **Domain** property.
2. Copy the `TXT` record it shows into the domain's DNS at the registrar (Cloudflare DNS → DNS → Records → Add record, type `TXT`, name `@`). Wait for it to propagate, then click **Verify**.
3. In the property, open **Indexing → Sitemaps**, enter `sitemap.xml` and submit. The file is generated at `/sitemap.xml` on every deploy.

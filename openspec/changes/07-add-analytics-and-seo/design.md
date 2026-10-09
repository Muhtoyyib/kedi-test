## Decisions

### Loading third-party scripts

`loaders.ts` exports `loadAnalytics(ids)`, which runs once when consent becomes `true`:

- GA4: inject `https://www.googletagmanager.com/gtag/js?id=G-…` (async); `gtag('config', id, {send_page_view: false})`; page views are sent manually on route change (`page_view` with `page_location`, `page_title`), because the router is client-side after the first load.
- Meta: standard `fbq` stub + `fbq('init', id)` + `PageView` on each route change. No advanced matching.
- Clarity: standard snippet with the project ID.
  All wrapped in `requestIdleCallback` (fallback `setTimeout(…, 1500)`). `track()` buffers up to 20 events before load and flushes after.

### Event typing

```ts
type AnalyticsEvent =
  | {event: "add_to_cart"; item_id: string; quantity: number; price?: number; location: "card" | "pdp" | "sticky_bar"}
  | {event: "whatsapp_chat_click"; location: WhatsAppLocation; context?: string}
  | …   // one member per row in docs/analytics-events.md
```

A mapping table converts members to Meta standard events. A unit test asserts every doc row has a member (the doc table is parsed in the test).

### Attribution

On first page view of a session: if any `utm_*` param is present, store `{source, medium, campaign, landing_path, at}` in sessionStorage `attribution:v1` (first touch per session). `getAttribution()` is read by the order payload and form payloads.

### Metadata defaults

- Title: `getPageTitle()` from site config. Description: page-specific (each page change provides it; max 155 chars).
- Canonical: `VITE_SITE_URL + path` without query string, with a trailing slash policy matching `auto-trailing-slash` (no trailing slash except root).
- OG: `og:type` (`website`, `product` for products, `article` for articles), `og:image` (product main image 1200w webp, article cover, or default), `og:locale` `en_NG`.
- `noindex` for `/thank-you/*` and the 404.

### LocalBusiness data

From site config + settings: name, url, telephone, address (`PostalAddress`, addressCountry `NG`), `openingHours` text (also parsed to `openingHoursSpecification` when it matches `Mon–Sat, 9:00 AM – 6:00 PM`; otherwise omitted), `areaServed` = service areas, `sameAs` = socials + Google Business Profile, `parentOrganization` **omitted** (the business is independent; don't imply KEDI ownership). Product `brand` = `{"@type":"Brand","name":"KEDI"}` (true: KEDI is the product brand). `seller` = the business.

### Sitemap

`/sitemap.xml` route (prerendered) builds entries from the static route table, catalog products/categories and `learn` articles, with priorities from `docs/routes-and-sitemap.md`, `lastmod` = catalog `generatedAt` (catalog pages) or article `date`. `/robots.txt`: `Allow: /`, `Disallow: /thank-you/`, `Sitemap: {site}/sitemap.xml`.

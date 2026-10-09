# Architecture

## 1. Shape of the system

```
                 ┌──────────────────────── Google Sheet (client owns) ───────────────────────┐
                 │ Products · Categories · Product FAQs · Settings · Delivery · Seminar      │
                 │ Schedule  (edited by client)                                               │
                 │ Orders · Leads & Customers · Referrals · Reorder Queue · Dashboard ·       │
                 │ Publish Log  (written by Apps Script)                                      │
                 └───────────────▲───────────────────────────────┬────────────────────────────┘
                                 │ read/write                    │ "KEDI Website → Publish website"
                    ┌────────────┴─────────────┐                 ▼
                    │  Apps Script web app     │      GitHub REST: workflow_dispatch
                    │  (apps-script/)          │                 │
                    │  GET  ?action=catalog    │◄────────┐       ▼
                    │  GET  ?action=image      │  build  │  GitHub Actions deploy.yml
                    │  GET  ?action=doc_image  │  time   │
                    │  POST order/lead/contact │  time   │  (push · nightly · dispatch)
                    │  daily to-do email       │         │   1. catalog:fetch  ─────┘
                    └────────────▲─────────────┘         │   2. lint · test · build (prerender)
                                 │ run time              │   3. wrangler deploy
            sendBeacon / fetch   │ (text/plain JSON)     ▼
   ┌─────────────────────────────┴───────┐     Cloudflare Workers static assets
   │  Visitor's browser (static site)    │◄──── [domain] (free plan, global CDN)
   │  cart in localStorage, ?ref capture │
   └───────────────┬─────────────────────┘
                   │ location.href = https://wa.me/234…?text=…
                   ▼
           WhatsApp Business App (distributor's phone)
```

- **Build time** (GitHub Actions): the site pulls the catalog (products, categories, product FAQs, settings, delivery fees, seminar schedule, seminar highlights, videos, customer stories and articles, with article text converted from Google Docs) and all images from the Apps Script, then prerenders every page to static HTML.
- **Run time** (browser): orders, forms and referral codes are posted to the same Apps Script web app. WhatsApp opens through `wa.me` links.
- **No server code runs on Cloudflare.** The Worker is assets-only, so visits do not use Worker request quota.

## 2. Stack and why

| Concern                               | Choice                                                                                                     | Why                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Runtime / package manager             | Bun 1.4 (`packageManager: bun@1.4.2`)                                                                      | Same as Rixl landing; fast installs in CI                                                      |
| Toolchain                             | Vite+ (`vite-plus`, `vp` CLI)                                                                              | Same as Rixl: one tool for dev, build, lint (oxlint), fmt (oxfmt), test (vitest), staged hooks |
| Framework                             | TanStack Start + TanStack Router, **SPA mode + full prerender**                                            | Type-safe routes and `head()` meta, static HTML for every page, same patterns as Rixl          |
| UI                                    | React 19 with React Compiler                                                                               | Same as Rixl                                                                                   |
| Styling                               | Tailwind CSS 4 with `@theme` tokens                                                                        | Same as Rixl; lint rules forbid raw colours                                                    |
| Lint rules                            | oxlint plugins `react`, `react-perf`, `typescript`, `jsx-a11y` + `@shadcn/lint` + Rixl's complexity limits | Copy `lint` block from Rixl `vite.config.ts`                                                   |
| Headless UI                           | `@base-ui/react` (Dialog for the drawer)                                                                   | Same as Rixl                                                                                   |
| Articles, stories, highlights, videos | Google Sheet + Google Docs, converted to typed JSON by Apps Script at build time                           | The client publishes content without a developer                                               |
| Legal pages                           | `fumadocs-mdx` (one `legal` collection; no fumadocs-ui layout)                                             | Developer-edited text with typed frontmatter, as in Rixl's blog                                |
| Motion                                | `motion`                                                                                                   | Same as Rixl; used sparingly                                                                   |
| Icons                                 | `lucide-react`                                                                                             | Same as Rixl                                                                                   |
| Fonts                                 | `@fontsource-variable/plus-jakarta-sans`                                                                   | See design system                                                                              |
| Image processing                      | `sharp` (build script only)                                                                                | AVIF/WebP responsive sets from Drive originals                                                 |
| Tests                                 | Vitest (jsdom) + Testing Library + `fast-check` for pure logic                                             | Same as Rixl                                                                                   |
| Hosting                               | Cloudflare Workers static assets via `wrangler`                                                            | Free, global, same as Rixl's deploy target                                                     |
| CI/CD                                 | GitHub Actions                                                                                             | Free minutes cover ~3-minute builds several times a day                                        |
| Data + endpoint                       | Google Sheets + Apps Script web app                                                                        | Free, client-owned, no server to maintain                                                      |

**Not included** (deliberately): Paraglide i18n (English only for now), fumadocs-ui, dark mode, any server runtime, any database, any auth.

## 3. Directory layout (target)

```
website/
├── AGENTS.md / CLAUDE.md / README.md
├── .agents/rules/                 # agent rules
├── .github/workflows/deploy.yml   # build + deploy (push, nightly, dispatch)
├── .github/workflows/preview.yml  # PR preview (wrangler versions upload)
├── apps-script/                   # Google Apps Script project (clasp)
│   ├── appsscript.json
│   ├── src/*.ts                   # router, catalog, client content + Doc conversion, orders, forms, referrals, automations, publish
│   └── README.md                  # deploy steps for the client's Google account
├── content/
│   ├── legal/*.mdx                # Privacy, terms, health disclaimer, delivery & returns
│   ├── about.ts, business.ts      # About/host and business-opportunity copy
│   └── faq.ts                     # FAQ items (grouped, tagged by page)
│                                  # (highlights, videos, stories, articles live in the client's Sheet/Docs)
├── docs/                          # these docs
├── openspec/                      # specs and changes
├── public/
│   ├── _headers                   # security + cache headers
│   ├── favicon.svg, icon.png, apple-icon.png, manifest.webmanifest
│   └── media/                     # generated images: products, categories, highlights, stories, article covers and inline images, video posters (git-ignored)
├── scripts/
│   ├── fetch-catalog.ts           # pulls catalog JSON + images, writes src/generated
│   ├── lib/                       # parsing, image pipeline (unit tested)
│   └── fixtures/catalog.fixture.json
├── src/
│   ├── routes/                    # TanStack file routes (thin)
│   ├── features/<page>/           # view.tsx, components/<section>.tsx, content.ts
│   ├── components/{ui,layout,marketing}/
│   ├── lib/                       # site-config, catalog access, cart, order, referral, analytics, seo, phone, money, dates
│   ├── generated/                 # catalog.json, images.json (git-ignored, written by fetch-catalog)
│   ├── styles/app.css             # tokens
│   └── test-utils/
├── source.config.ts               # fumadocs-mdx `legal` collection
├── vite.config.ts                 # vite-plus config (fmt, lint, staged, plugins, prerender pages)
├── vitest.config.ts
├── wrangler.jsonc
└── package.json
```

## 4. Build pipeline

1. `vp run catalog:fetch` (`scripts/fetch-catalog.ts`):
   - `CATALOG_SOURCE=live` (default in CI): `GET {APPS_SCRIPT_URL}?action=catalog&token={CATALOG_READ_TOKEN}`. `CATALOG_SOURCE=fixture` (default in local dev): read `scripts/fixtures/catalog.fixture.json`.
   - Parse and validate with the typed parser (`scripts/lib/parse-catalog.ts`). On any invalid row, **fail with a readable list** ("Products row 7 (KD-P007): price_ngn is not a number"), and do not deploy.
   - For each image ID not already cached (cache key: Drive file ID + `modifiedTime`): `GET ?action=image&id=…&token=…` → base64 → `sharp` → `public/media/p/<productId>/<index>-<width>.{avif,webp}` at widths 320, 480, 768, 1200 → record intrinsic width/height in `src/generated/images.json` (image boxes use the `brand-soft` background while loading).
   - The same pipeline runs for highlight photos (`public/media/h/…`), story photos (`public/media/s/…`), article covers and inline Doc images (`public/media/a/<articleId>/…`, inline images fetched with `?action=doc_image`).
   - Video posters: YouTube → `https://i.ytimg.com/vi/{id}/hqdefault.jpg`; TikTok → thumbnail URL from `https://www.tiktok.com/oembed?url={url}`. Both are downloaded and run through the same pipeline, so pages never hotlink third-party images.
   - Compliance check on client-written text (articles, stories, highlight comments): banned health-claim words (`docs/copy-and-compliance.md` §2) outside the "When to see a doctor" section → **build fails** with the item ID, the sentence and the word. The Sheet's "Check content for errors" menu runs the same check before publishing.
   - Write `src/generated/catalog.json` with `source: "live" | "fixture"` and `generatedAt`.
2. `vp run generate`: fumadocs-mdx sources (legal pages) and the route tree.
3. `vp run lint && vp test --run`.
4. `vp build`: TanStack Start prerenders every page listed in `vite.config.ts` (static routes + one per product, category, article and legal page).
5. `tsc -b`.
6. Guard (`scripts/assert-production-ready.ts`, run in CI only): fails if `catalog.source === "fixture"` or if `site-config.ts` still contains `[` placeholders.

## 5. Deploy pipeline (`.github/workflows/deploy.yml`)

- **Triggers:** `push` to `main`; `schedule: "0 0 * * *"` (01:00 WAT nightly, so seminar dates and stock stay fresh); `workflow_dispatch` with input `reason` (sent by the Sheet's Publish button).
- **Concurrency:** group `deploy`, `cancel-in-progress: false` (queued).
- **Steps:** checkout → setup Bun → `bun install --frozen-lockfile` → restore image cache (`actions/cache` on `public/media` + `.cache/images.json`) → `vp run catalog:fetch` → `vp run ci:build` → `scripts/assert-production-ready.ts` → `wrangler deploy` → POST result to `{APPS_SCRIPT_URL}?action=publish_result` (status, commit, duration, run URL). The Sheet's `Publish Log` tab shows it.
- **Failure:** if any step fails, nothing is deployed; the previous version stays live, and the Publish Log row shows "Failed" with the run URL.
- **PR previews** (`preview.yml`): `wrangler versions upload` with fixture catalog; comment the preview URL.

### Secrets (GitHub → Settings → Secrets)

| Secret                  | Used by                                |
| ----------------------- | -------------------------------------- |
| `APPS_SCRIPT_URL`       | catalog fetch, publish result          |
| `CATALOG_READ_TOKEN`    | catalog/image read auth                |
| `CLOUDFLARE_API_TOKEN`  | wrangler deploy (Workers Scripts:Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | wrangler deploy                        |

### Script properties (Apps Script → Project settings)

| Property             | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `CATALOG_READ_TOKEN` | Must match the GitHub secret                                            |
| `GITHUB_TOKEN`       | Fine-grained PAT, this repo only, `Actions: Read and write`             |
| `GITHUB_REPO`        | `owner/repo`                                                            |
| `DISTRIBUTOR_EMAIL`  | Daily to-do email recipient                                             |
| `WHATSAPP_NUMBER`    | Digits only, e.g. `2348012345678`, for one-tap links in the to-do email |
| `SITE_URL`           | For links in emails                                                     |

## 6. Environment variables (site)

| Variable                                                  | When               | Purpose                                                                              |
| --------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------ |
| `VITE_SITE_URL`                                           | build              | Canonical origin, e.g. `https://[domain]`                                            |
| `VITE_APPS_SCRIPT_URL`                                    | build (inlined)    | Endpoint for orders/forms (public; protected by validation, honeypot and rate limit) |
| `VITE_GA4_ID`                                             | build              | Google Analytics 4 measurement ID (`G-…`)                                            |
| `VITE_META_PIXEL_ID`                                      | build              | Meta Pixel ID                                                                        |
| `VITE_CLARITY_ID`                                         | build              | Microsoft Clarity project ID                                                         |
| `APPS_SCRIPT_URL`, `CATALOG_READ_TOKEN`, `CATALOG_SOURCE` | catalog fetch only | Never exposed to the client                                                          |

`.env.example` lists all of them. Missing analytics IDs disable that tracker silently. A missing `VITE_APPS_SCRIPT_URL` disables order logging and forms and shows the WhatsApp fallback (see change `05`).

## 7. Apps Script web app contract

Deployed as a web app: **Execute as: Me (client's Google account)**, **Who has access: Anyone**. One URL serves everything.

### GET

| Query                                             | Auth  | Response                                                               |
| ------------------------------------------------- | ----- | ---------------------------------------------------------------------- |
| `?action=catalog&token=…`                         | token | `200 {ok:true, catalog: CatalogPayload}` (see `docs/content-model.md`) |
| `?action=image&id=<driveFileId>&token=…`          | token | `{ok:true, mimeType, modifiedTime, base64}` (≤ 8 MB)                   |
| `?action=doc_image&doc=<docId>&n=<index>&token=…` | token | The n-th inline image of a Google Doc: `{ok:true, mimeType, base64}`   |
| `?action=publish_result&token=…` (POST)           | token | Appends to Publish Log                                                 |
| anything else                                     | —     | `{ok:false, code:"not_found"}`                                         |

### POST (browser → script)

- `Content-Type: text/plain;charset=utf-8` (a "simple request": no CORS preflight, which Apps Script cannot answer).
- Body: JSON `{ "type": "...", "payload": {...}, "hp": "" }`. `hp` is the honeypot field; non-empty → silently `{ok:true}` and drop.
- Response: `{ok:true, id}` or `{ok:false, code}` where `code ∈ invalid_payload | rate_limited | duplicate | server_error`. ContentService JSON responses are readable cross-origin for simple requests, so forms can show success/failure. Orders use `navigator.sendBeacon` and do not wait.

| `type`              | Payload                                              | Writes to                                   |
| ------------------- | ---------------------------------------------------- | ------------------------------------------- |
| `order`             | `OrderPayload` (change 05)                           | Orders (+ upsert Leads & Customers)         |
| `contact`           | name, phone, email?, message, consent                | Leads & Customers (source `contact_form`)   |
| `business_interest` | name, phone, location, occupation, consent           | Leads & Customers (business interest = Yes) |
| `referral_code`     | firstName, phone, code                               | Referrals                                   |
| `seminar_interest`  | name, phone, consent (only when Luma is unavailable) | Leads & Customers                           |

Protections: payload size ≤ 10 KB; field length limits; phone must normalise to a Nigerian mobile; `LockService` around writes; `CacheService` rate limit of 5 POSTs per phone per 10 minutes and 60 per minute globally; duplicate order IDs ignored.

## 8. Security headers (`public/_headers`)

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data: https://i.ytimg.com https://www.google-analytics.com https://www.facebook.com https://*.clarity.ms https://images.lumacdn.com; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://www.clarity.ms https://embed.lu.ma; connect-src 'self' https://script.google.com https://script.googleusercontent.com https://*.google-analytics.com https://*.analytics.google.com https://www.facebook.com https://*.clarity.ms; frame-src https://lu.ma https://luma.com https://www.youtube-nocookie.com https://www.google.com https://www.tiktok.com; style-src 'self' 'unsafe-inline'; font-src 'self'; form-action 'self'; base-uri 'self'
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/media/*
  Cache-Control: public, max-age=31536000, immutable
```

`'unsafe-inline'` for scripts is needed for TanStack's inline hydration data and the JSON-LD blocks; revisit with hashes later.

## 9. Performance budget

| Metric              | Budget (Moto G Power, Slow 4G)             |
| ------------------- | ------------------------------------------ |
| LCP                 | < 2.5 s                                    |
| CLS                 | < 0.05                                     |
| INP                 | < 200 ms                                   |
| JS per route (gzip) | < 120 KB (home), < 140 KB (shop with cart) |
| Font                | 1 file, < 45 KB                            |
| Hero image          | AVIF ≤ 80 KB at 768w                       |

Rules: third-party scripts load only after consent and after `requestIdleCallback`; Luma, YouTube and Maps embeds use click-to-load facades or `loading="lazy"` iframes below the fold.

## 10. Decisions log

| Decision                                                                                | Alternatives                                          | Why                                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rixl stack (TanStack Start + Vite+) instead of the plan's Astro/Next.js suggestion      | Astro, Next.js static export                          | One toolchain across the developer's projects; Rixl landing is a working reference for config, lint rules and Cloudflare deploy. Prerender gives the same static output.                                                                                    |
| Cloudflare Workers static assets instead of Cloudflare Pages                            | Pages + deploy hook                                   | Matches Rixl's deploy target; deploys run from GitHub Actions, so we don't need Pages deploy hooks. Static asset requests are free and don't count against Worker limits.                                                                                   |
| Publish = GitHub `workflow_dispatch` from Apps Script                                   | Cloudflare deploy hook; runtime fetch of the Sheet    | Same build path for push, nightly and publish; failed data never reaches production; Sheet shows the result.                                                                                                                                                |
| Order ID generated in the browser                                                       | Server-issued sequential ID                           | No wait before WhatsApp opens; ID in the message always matches the sheet.                                                                                                                                                                                  |
| `sendBeacon` for orders, `fetch` for forms                                              | `fetch` everywhere                                    | The beacon finishes even as the page navigates to WhatsApp; forms need the result to show success.                                                                                                                                                          |
| Referral codes generated in the browser                                                 | Server-issued codes                                   | No backend needed; deterministic (same person → same code); collisions flagged by Apps Script.                                                                                                                                                              |
| Product images pulled through Apps Script                                               | Public Drive links                                    | No public sharing of the client's Drive; Drive hotlinks are slow and unreliable.                                                                                                                                                                            |
| Articles, stories, highlights and videos in the Sheet (articles written in Google Docs) | MDX files in the repo; a headless CMS (Sanity, Decap) | The client is a business owner, not a developer: one place (the Sheet) and one button (Publish) for everything. Docs is familiar for long text. A CMS is another login and tool to learn, and Option 2's admin dashboard replaces all of this later anyway. |

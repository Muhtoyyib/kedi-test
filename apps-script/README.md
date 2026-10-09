# Apps Script backend

The Google Sheet is the client's single admin surface: catalog source of truth, order/form inbox, follow-up engine and the "Publish website" button. This folder builds the Apps Script project that powers it.

## What's inside

- `src/` — TypeScript source. Domain logic is pure over a `Store` interface so it runs in Node tests; the GAS-facing parts (`main.ts`, `setup.ts`, `images.ts`) stay thin.
- `test/` — Vitest suite with an in-memory `MemoryStore` (no Google account needed).
- `build.mjs` — esbuild → `dist/Code.js` (single IIFE; entry points wired onto `globalThis`).
- `appsscript.json` — manifest (Africa/Lagos, V8, web app as deploying-user + anonymous access).
- `.clasp.json` — clasp config; fill in `scriptId` after creating the project.

## Dev workflow

```bash
bun install
bun run test        # vitest
bun run typecheck   # tsc --noEmit
bun run build       # esbuild → dist/
```

## One-time setup (client's Google account)

1. Create the client's Google Sheet (the "workbook"). Extensions → Apps Script creates a bound project — copy its Script ID into `.clasp.json`.
2. `bun run build && bunx clasp push` (first push uploads `dist/` — make sure `.clasp.json` `rootDir` is `dist`).
3. In the Sheet, reload → menu **KEDI Website → Setup workbook (run once)**. This creates all tabs, dropdowns, the Dashboard formulas, the Drive folders and the article template Doc.
4. **KEDI Website → Install daily triggers (run once)** — installs the 07:00 WAT to-do email trigger and the Orders on-edit trigger.
5. Set Script Properties (Apps Script → Project Settings → Script Properties):

   | Property             | What                                                              |
   | -------------------- | ----------------------------------------------------------------- |
   | `CATALOG_READ_TOKEN` | Random string; also set as `CATALOG_READ_TOKEN` in GitHub secrets |
   | `GITHUB_TOKEN`       | Fine-grained PAT with `actions:write` on the site repo            |
   | `GITHUB_REPO`        | e.g. `owner/kedi-site`                                            |
   | `DISTRIBUTOR_EMAIL`  | Where the 07:00 to-do email goes                                  |
   | `BRAND_NAME`         | Used in WhatsApp message templates                                |

6. Deploy: Apps Script → **Deploy → New deployment → Web app** → Execute as _Me_, access _Anyone_. Copy the `/exec` URL.

## Publishing updates to the script

Edit → `bun run build && bunx clasp push` → **Deploy → Manage deployments → ✏️ → New version → Deploy**. The web-app URL never changes.

## GitHub secrets (website repo)

- `APPS_SCRIPT_URL` — the `/exec` URL above (also `VITE_APPS_SCRIPT_URL` for builds)
- `CATALOG_READ_TOKEN` — same value as the Script Property
- Cloudflare secrets per `../.github/workflows/deploy.yml`

## Rotating tokens

Generate a new `CATALOG_READ_TOKEN`, update the Script Property and the GitHub secret, then trigger a deploy (Sheet menu → Publish website). Old tokens stop working immediately.

## Endpoints

- `GET ?action=catalog&token=…` — validated catalog JSON (errors → `invalid_catalog` + issues list)
- `GET ?action=image&id=<driveFileId>&token=…` — image as base64 (≤ 8 MB)
- `GET ?action=doc_image&doc=<docId>&n=<index>&token=…` — nth inline image of a Doc
- `POST {type, payload, hp?}` — `order`, `contact`, `business_interest`, `seminar_interest`, `referral_code`
- `POST ?action=publish_result` (token in body) — called by the deploy workflow

Browser POSTs send `Content-Type: text/plain` (no preflight). `hp` is the honeypot — non-empty = silently accepted and dropped.

## Rate limits

5 submissions per phone per 10 min, 60 requests/min globally, 10 KB max body — enforced in `src/router.ts` via CacheService.

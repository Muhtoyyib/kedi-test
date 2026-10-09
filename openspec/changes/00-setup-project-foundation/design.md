## Context

The reference implementation is `~/career/gig-work/work/rixl/landing`. Copy files from there and then trim them; don't write configs from memory. The data pipeline (change 04) and Apps Script (change 03) are separate, but this change must leave hooks for them: the `catalog:fetch` script name, `src/generated/` git-ignored, and the guard script.

## Goals / Non-Goals

**Goals**

- `vp run dev`, `vp run lint`, `vp test --run`, `vp run build` work on a fresh clone with only the fixture catalog.
- Every route listed in `vite.config.ts` prerenders to `dist/client/<path>/index.html`.
- `wrangler deploy` serves `dist/client` with real 404 status for unknown paths.

**Non-Goals**

- Any UI beyond the holding page (change 01 onward).
- Catalog fetching (change 04). This change only adds the script entry and a fixture-reading stub.

## Decisions

### 1. Files copied from Rixl landing, then edited

| Rixl file                              | Action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                         | Copy scripts `build`, `ci:build`, `dev`, `lint`, `lint:fix`, `format`, `test`, `test:ui`, `test:coverage`, `typecheck`, `prepare`. Drop `pregenerate`, `blog:preview`, `stryker*`, `cf:upload`, `generate:paraglide`, `generate:icons`. Add `catalog:fetch` (`node scripts/fetch-catalog.ts`), `assert:prod` (`node scripts/assert-production-ready.ts`), `deploy` (`wrangler deploy`). Set `name: "kedi-distributor-site"`, `packageManager: "bun@1.4.2"`, same `devEngines` and `overrides`. |
| `vite.config.ts`                       | Keep the `fmt` block, the whole `lint` block (rules, plugins, jsPlugins, overrides minus `og.server.tsx`) and the `staged` block. Plugins: `mdx(await import("./source.config.ts"))`, `tailwindcss()`, `tanstackStart({...})`, `react({compiler: true})`. Remove paraglide and icon plugins. `server.port: 5180`.                                                                                                                                                                              |
| `tsconfig.json`                        | Copy as-is (paths `@/*`, `fumadocs-mdx:collections/*`).                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `vitest.config.ts` / `vitest.setup.ts` | Copy; remove paraglide plugin; keep the fumadocs collections mock resolver pattern; coverage `include`: `src/lib/**`.                                                                                                                                                                                                                                                                                                                                                                          |
| `.node-version`                        | `24`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `src/router.tsx`                       | Copy (`defaultPreload: "intent"`, `scrollRestoration: true`, `defaultNotFoundComponent`).                                                                                                                                                                                                                                                                                                                                                                                                      |
| `src/routes/__root.tsx`                | Copy the head/canonical pattern; remove locale/alternate logic, theme script and fumadocs `TanstackProvider`; `lang="en-NG"`.                                                                                                                                                                                                                                                                                                                                                                  |
| `src/server.ts`                        | Not needed (no paraglide middleware). Use TanStack Start's default server entry.                                                                                                                                                                                                                                                                                                                                                                                                               |

### 2. Prerender page list

`vite.config.ts` builds `pages` at config time:

```ts
const catalog = readCatalog(); // src/generated/catalog.json, or the fixture if missing
const staticPaths = [
  "/",
  "/shop",
  "/seminars",
  "/learn",
  "/stories",
  "/business-opportunity",
  "/about",
  "/faq",
  "/contact",
  "/refer",
  "/privacy",
  "/terms",
  "/health-disclaimer",
  "/delivery-and-returns",
  "/thank-you/contact",
  "/thank-you/business",
  "/thank-you/referral",
  "/thank-you/seminar",
  "/sitemap.xml",
  "/robots.txt",
];
const productPaths = catalog.products.map((p) => `/products/${p.slug}`);
const categoryPaths = catalog.categories.map((c) => `/shop/${c.slug}`);
const articlePaths = catalog.articles.map((a) => `/learn/${a.slug}`); // articles come from the Sheet/Docs (change 04)
```

Until a page's change lands, its path is left out of the list (add each path in the change that builds the page). `tanstackStart` options: `spa.enabled: true`, `prerender.enabled: true`, `crawlLinks: false`, `autoSubfolderIndex: true`, **`failOnError: true`** (unlike Rixl, a broken page must fail the build).

### 3. Hosting config

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "kedi-site",
  "compatibility_date": "2026-10-01",
  "assets": {
    "directory": "./dist/client",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page",
  },
}
```

No `main`: assets-only, so no Worker invocations or quota. A custom domain is added in the Cloudflare dashboard at launch.

### 4. Production guard

`scripts/assert-production-ready.ts` exits non-zero when:

- `src/generated/catalog.json` has `source: "fixture"`;
- `src/lib/site-config.ts` contains a `[` followed by a letter or digit (placeholder pattern `/\[[A-Za-z0-9+]/`);
- `VITE_SITE_URL` is unset or not `https://`.

It runs in `deploy.yml` only (not in previews or local builds).

### 5. Workflows

As specified in `docs/architecture.md` §5. Use `oven-sh/setup-bun@v2`, `actions/cache@v4` for `public/media` and `.cache/`, and `cloudflare/wrangler-action@v3` for deploys. `preview.yml` runs on `pull_request`, builds with `CATALOG_SOURCE=fixture`, runs `wrangler versions upload`, and comments the preview URL.

### 6. Holding page

`src/routes/index.tsx` renders `siteConfig.name`, the line "Our new website is on the way. Chat with us on WhatsApp to order.", and a WhatsApp link. No styling beyond defaults. Change 10 replaces it.

## Risks / Trade-offs

- [Vite+ and TanStack versions drift from Rixl] → Pin to the exact versions in Rixl's `bun.lock` at copy time; upgrade together later.
- [`failOnError: true` makes one broken product page block the whole deploy] → That is intended: the previous version stays live, and the Publish Log shows the failure.
- [`autoSubfolderIndex: true` differs from Rixl] → Needed for `html_handling: auto-trailing-slash` to serve `/shop/` as `/shop/index.html` on the assets Worker.

## Migration Plan

New project. First deploy goes to the `*.workers.dev` URL only. The custom domain is attached at launch (plan Week 6).

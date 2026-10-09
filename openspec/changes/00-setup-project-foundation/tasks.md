## 1. Scaffold

- [x] 1.1 `git init` in `website/`; add `.gitignore` (node_modules, dist, .env*, !.env.example, src/generated, public/media, .cache, .wrangler, coverage, routeTree.gen.ts is committed as in Rixl)
- [x] 1.2 Create `package.json` per design §1 and run `bun install`; pin versions to Rixl landing's lockfile for shared packages
- [x] 1.3 Copy and trim `vite.config.ts`, `tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts`, `.node-version` per design §1
- [x] 1.4 Add `source.config.ts` with an empty `legal` collection definition (filled by change 08) so fumadocs-mdx generates
- [x] 1.5 Add `src/styles/app.css` importing tailwind and the font (tokens come in change 01)

## 2. App skeleton

- [x] 2.1 `src/router.tsx`, `src/routes/__root.tsx` (meta charset/viewport/theme-color `#317ABE`, canonical link from `VITE_SITE_URL`, `lang="en-NG"`)
- [x] 2.2 `src/lib/site-config.ts` exactly as `docs/content-model.md` §3, plus `getPageTitle(title?)` → `"{title} | {name}"` or `"{name} — {tagline}"`
- [x] 2.3 `src/lib/__tests__/site-config.test.ts`: `getPageTitle` both branches; WhatsApp number is digits only once filled (skip while placeholder)
- [x] 2.4 Holding home page `src/routes/index.tsx` (design §6) and `src/components/not-found.tsx` minimal 404
- [x] 2.5 `src/lib/untrusted.ts` with `UntrustedValue`/`UntrustedRecord` types and `isRecord`/`readString`/`readNumber` helpers (copy pattern from Rixl `src/lib/untrusted.ts`), with tests

## 3. Build and prerender

- [x] 3.1 `scripts/lib/read-catalog.ts` (reads `src/generated/catalog.json`, falls back to `scripts/fixtures/catalog.fixture.json`) — fixture file created with 3 clearly fake products named "Fixture Product A/B/C" in 2 categories, used only by dev/tests
- [x] 3.2 Prerender page list in `vite.config.ts` per design §2 (only `/` for now) and `failOnError: true`
- [x] 3.3 `scripts/fetch-catalog.ts` stub: when `CATALOG_SOURCE=fixture` copy fixture to `src/generated/catalog.json` with `source: "fixture"`; otherwise exit 1 with "Implemented in change 04"
- [x] 3.4 `scripts/assert-production-ready.ts` per design §4, with unit tests for each failing condition (`scripts/lib/__tests__/assert-production-ready.test.ts`)
- [x] 3.5 `vp run build` produces `dist/client/index.html` and `dist/client/404.html`

## 4. Hosting and CI

- [x] 4.1 `wrangler.jsonc` per design §3; `public/_headers` per `docs/architecture.md` §8; `public/favicon.svg` (sun-arc mark on brand blue) and `manifest.webmanifest` (name from config, `theme_color` `#317ABE`, `background_color` `#FFFFFF`)
- [x] 4.2 `.env.example` listing every variable in `docs/architecture.md` §6 with comments
- [x] 4.3 `.github/workflows/deploy.yml` and `.github/workflows/preview.yml` per design §5
- [x] 4.4 Document required GitHub secrets in `README.md`

## 5. Verification

- [x] 5.1 Fresh clone: `bun install && vp run catalog:fetch` (fixture) `&& vp run lint && vp test --run && vp run build` all pass
- [x] 5.2 `npx wrangler dev` serves `/` and returns 404 status with `404.html` for `/does-not-exist`
- [x] 5.3 `node scripts/assert-production-ready.ts` fails locally (fixture + placeholders), as expected
- [ ] 5.4 Preview workflow posts a working `workers.dev` URL on a test PR

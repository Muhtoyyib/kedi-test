## Why

Nothing exists yet. Every later change needs the same toolchain, lint rules, build, prerender and deploy path. Copying the proven setup from the Rixl landing app (`~/career/gig-work/work/rixl/landing`) avoids re-deciding tooling and gives agents a working reference.

## What Changes

- Scaffold `website/` as a Bun + Vite+ + TanStack Start + React 19 + Tailwind 4 app, mirroring Rixl landing's `package.json` scripts, `vite.config.ts` (fmt, lint, staged, plugins), `tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts` and `.node-version`.
- **Remove what this site does not need** from the Rixl setup: Paraglide/inlang i18n, fumadocs-ui, blog submodule hooks, `@rixl/*` packages, Stryker, OG image rendering (`@takumi-rs/image-response`), shaders, canvas-confetti, zbsearch, react-doctor (optional; keep if wanted).
- Keep `fumadocs-mdx` (used by change 08 for the legal pages), `@base-ui/react`, `motion`, `lucide-react`, `cn`.
- Add `@fontsource-variable/plus-jakarta-sans`, `sharp` (dev), `wrangler` (dev).
- Configure **full static prerender** in SPA mode, with a page list built from the catalog (products, categories) and content (articles, legal) at config time.
- Add `wrangler.jsonc` (assets-only Worker, `404-page` handling), `public/_headers`, `.env.example`, `.gitignore`.
- Add `src/lib/site-config.ts` with every client value as a `[Placeholder]` (see `docs/content-model.md` §3).
- Add the production-readiness guard script and GitHub Actions workflows (`deploy.yml`, `preview.yml`) described in `docs/architecture.md` §5.
- Add a minimal root route, router, not-found fallback and a holding home page (brand name + WhatsApp link). Change 10 replaces the holding page.

## Capabilities

### New Capabilities

- `platform/build-and-deploy`: how the site is built, prerendered and deployed, and what blocks a deploy.
- `platform/site-config`: the single source of brand and contact values, and the placeholder guard.

## Impact

- New project; no existing code is affected.
- Client inputs needed before first **production** deploy: `[domain]`, Cloudflare account, GitHub repo, all `site-config.ts` placeholders (`docs/client-inputs.md`). Preview deploys work without them.
- Depends on: nothing. Unlocks: every other change.

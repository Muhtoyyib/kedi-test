# [Brand Name] — Independent KEDI Distributor Website

## What this is

The public website for an independent KEDI Healthcare distributor in [City], Nigeria. Its only jobs:

1. Earn trust in five seconds (genuine products, real person, local delivery).
2. Turn visitors into one of three actions: **order on WhatsApp**, **register for the weekly seminar**, or **start a WhatsApp chat**.
3. Capture every lead and order in the client's Google Sheet so follow-up never gets missed.

It is **not** an e-commerce store (no checkout, no accounts, no payments on the site) and **not** the official KEDI site.

The business plan is `../KEDI_Digital_Sales_System_Implementation_Plan.md`. Read sections 2–3 and 10 before building anything.

## How work is organised (OpenSpec)

All work is specified as OpenSpec changes in `openspec/changes/`. Apply them in the order in `docs/build-order.md`.

- **Foundation changes** (`00-`–`08-`) set up the project, design system, shell, data pipeline, ordering, referrals, analytics and content.
- **Page changes** (`10-`–`22-`) each build one page. Every page change has:
  - `proposal.md`, `design.md`, `tasks.md` for the page as a whole (route, meta, composition);
  - `sections/NN-<section>/` — one mini-change per visual section, each with its own `proposal.md`, `design.md` and `tasks.md`;
  - `specs/<page>/<section>/spec.md` — the behaviour contract for each section (kept at page level so `openspec validate` checks them).
- To build a section: read the page `proposal.md` → the section's `proposal.md` → its spec → its `design.md` → do its `tasks.md`, then tick the matching box in the page `tasks.md`.

Commands:

```bash
openspec list                         # changes and task progress
openspec status --change <name>       # artifact status
openspec validate <name> --strict     # validate specs
openspec archive <name>               # after a change is fully built and verified
```

## Stack

Same toolchain as the Rixl landing app (`~/career/gig-work/work/rixl/landing`), which is the reference implementation for configs and patterns:

- Bun 1.4 · Vite+ (`vp`) · TanStack Start/Router (static prerender) · React 19 (compiler) · TypeScript strict
- Tailwind CSS 4 (tokens in `src/styles/app.css`) · oxlint + @shadcn/lint · oxfmt
- Vitest + Testing Library · fumadocs-mdx (legal pages only) · motion · lucide-react
- Cloudflare Workers static assets (wrangler) · GitHub Actions deploys
- Google Sheet + Apps Script (`apps-script/`) as the data store and form/order endpoint

Full detail: `docs/architecture.md`.

## Commands (once 00-setup-project-foundation is applied)

```bash
vp run dev            # catalog from fixture, dev server on :5180
vp run catalog:fetch  # pull live catalog from the Sheet (needs APPS_SCRIPT_URL + CATALOG_READ_TOKEN)
vp run build          # fetch/generate + typecheck + prerender build
vp run lint           # oxlint, zero warnings
vp test --run         # vitest
vp fmt                # oxfmt
```

## Non-negotiable rules

- **Compliance** (`docs/copy-and-compliance.md`): no cure/treat/prevent claims; product text comes only from the Sheet's approved fields; "Independent KEDI Distributor" visible in header lockup and footer; no income claims; consent checkbox on every form.
- **Product truth lives in data, not components**: products, prices, delivery fees, bank details, seminar dates, highlights, videos, customer stories and articles come from the generated catalog (the client's Google Sheet and Docs); brand, phone, URLs come from `src/lib/site-config.ts`. Never hardcode them in JSX.
- **Placeholders**: client values not yet supplied stay as `[Placeholder]` strings **only** in `src/lib/site-config.ts` and content files, listed in `docs/client-inputs.md`. A test fails the production build while any remain.
- **Mobile first**: design and test at 360×640 first. Tap targets ≥ 44×44 px.
- **Performance**: no client JS on a page unless it does something; lazy-load iframes (Luma, maps, YouTube); images via the generated responsive set.
- **No raw colours or arbitrary values** in classNames — use tokens (`docs/design-system.md`).
- **No hover lift/scale/bounce** on buttons or cards (same rule as Rixl).

## Rule files

- `.agents/rules/anti-slop.md`
- `.agents/rules/code-style.md`
- `.agents/rules/compliance.md`
- `.agents/rules/content.md`
- `.agents/rules/design.md`
- `.agents/rules/testing.md`
- `.agents/rules/commits.md`

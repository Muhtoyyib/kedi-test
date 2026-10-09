---
trigger: always_on
description: Frontend code style rules.
---

## TypeScript

- Strict mode. No `any`. No `unknown` outside `src/lib/untrusted.ts` boundary helpers (oxlint enforces).
- Use `@/*` for `src/*` imports.
- Parse every external input (generated catalog JSON, localStorage, URL params, Apps Script responses) through a typed parser in `src/lib` before use.

## Structure

- Routes in `src/routes` are thin: `head()` for meta, `component` points to a feature view.
- Each page lives in `src/features/<page>/`: `view.tsx` composes sections; each section is `components/<section>.tsx`; content builders in `content.ts`.
- Shared primitives in `src/components/ui`; layout in `src/components/layout`; reusable marketing blocks in `src/components/marketing`.
- One exported component or hook per file. Max 250 lines per file, 50 per function, complexity 10 (oxlint).
- Pure logic (order message, order ID, referral code, price formatting, date logic) lives in `src/lib/**` with unit tests.

## Data

- Presentational components receive data as props; they never import the catalog JSON directly.
- Loading, empty, error and success states are explicit wherever data can be missing.
- Handle errors by code/state, never by matching message text.

## Styling

- Tailwind utilities with tokens from `src/styles/app.css`. No raw colours, no arbitrary values except layout and `tracking-*`/`leading-*` (oxlint shadcn rules).
- Merge classes with `cn` from the `cn` package.
- No inline styles.

## Product truth

- Brand name, phone, WhatsApp number, socials, URLs, city: `src/lib/site-config.ts` only.
- Products, prices, delivery fees, bank details, hours, seminars: generated catalog only.

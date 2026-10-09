## Decisions

- One dynamic route `src/routes/thank-you.$kind.tsx`, with `$kind` validated against a typed map; unknown kinds → notFound. Prerendered for the four kinds. `noindex`.
- WhatsApp orders do **not** use a thank-you page (the visitor leaves for WhatsApp). The return banner in change 05 covers that case.
- 404: TanStack `defaultNotFoundComponent` renders `NotFoundView`; the prerender writes `404.html`, which wrangler serves with status 404.

## Why

Grouped accordions keep a long FAQ scannable on phones.

## What Changes

- One block per group (h2 + `Accordion`), anchors per group and per question (`#how-to-pay`), so WhatsApp replies can link straight to an answer.

Spec: `../../specs/faq/faq-groups/spec.md`

## Impact

- `src/features/faq/components/faq-groups.tsx`; answers rendered from short markdown (links, bold) with a tiny safe renderer (no raw HTML).

## Why

Product-specific questions (taking with food, combining products) are best answered in KEDI's approved words, and ordering questions (payment, delivery) are the most common blockers.

## What Changes

- "Questions about {name}" accordion: the product's FAQs from the Sheet, followed by 3 general ordering FAQs (how to order, how to pay, delivery) from `content/faq.ts`, and a WhatsApp prompt.

Spec: `../../specs/product-detail/product-faqs/spec.md`

## Impact

- `src/features/product-detail/components/product-faqs.tsx`; FAQPage JSON-LD added to the route head when at least one product FAQ exists.

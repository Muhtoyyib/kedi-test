## Why

Dead ends lose customers. An empty category or a search with no matches must offer a next step, ideally a WhatsApp question, because the product may exist under another name.

## What Changes

- **No search results:** message, "Clear search" action, and "Ask us on WhatsApp" with the search term in the message.
- **Empty category:** message, link to all products, WhatsApp.

Spec: `../../specs/shop/empty-states/spec.md`

## Impact

- `src/features/shop/components/empty-state.tsx`; adds `searchEnquiry(term)` to `messages.ts`: "Hello [Brand Name]! I searched your website for "{term}" but couldn't find it. Do you have it?"

## Why

Many visitors want to ask a question rather than browse. A WhatsApp button always within thumb reach is the single highest-converting element for this audience (plan §3.3: "Floating WhatsApp button. Shown on every page").

## What Changes

- A round WhatsApp button fixed bottom-right on every page (hidden where the page provides its own sticky WhatsApp action, i.e. the product page sticky bar).
- After 20 seconds on the page, a small speech bubble "Need help choosing? Chat with us" appears once per session and can be closed.

Spec: `../../specs/site-shell/floating-whatsapp/spec.md`

## Impact

- `src/components/layout/site/floating-whatsapp.tsx`
- Uses `SiteLayout`'s `hideFloatingWhatsApp` prop.

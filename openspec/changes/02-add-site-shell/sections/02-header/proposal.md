## Why

In the first five seconds a visitor must see who this is (a named local business), that it is linked to KEDI but independent, and how to act (chat or shop). The header carries all three on every page.

## What Changes

- Sticky header with: the brand lockup (wordmark + "Independent KEDI Distributor"), desktop nav (Shop, Seminars, Learn, Stories, About), a Contact text link, the cart button with a count badge, and a "Chat on WhatsApp" button.
- On small screens: lockup, cart button, a compact WhatsApp icon button and the menu button (opens `03-mobile-menu`).

Spec: `../../specs/site-shell/header/spec.md`

## Impact

- `src/components/layout/site/header/{index,brand-lockup,desktop-nav,cart-button,menu-button}.tsx`
- Client input: wordmark SVG (optional), brand name, WhatsApp number.

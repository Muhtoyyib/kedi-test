## Why

Most visitors are on phones. They need every page within one tap from the menu, and a WhatsApp action and opening hours at hand.

## What Changes

- A full-screen menu panel opened from the header menu button below 1024px.
- Lists all pages in `mobileNav`, then a WhatsApp button, a call link, opening hours and social icons.

Spec: `../../specs/site-shell/mobile-menu/spec.md`

## Impact

- `src/components/layout/site/header/mobile-menu.tsx` (uses the `Drawer` primitive in full-screen mode, or a dedicated Dialog)
- Reads `getSettings().openingHours`.

## Why

Every page needs the same frame: a header that says who we are (an independent KEDI distributor) and offers WhatsApp and the cart, a footer with trust and legal information, a floating WhatsApp button, and cookie consent before any tracking. Building it once means pages only build their own content.

## What Changes

- Add `SiteLayout` (`src/components/layout/site/layout.tsx`) wrapping every page: skip link, announcement bar, header, `<main id="main">`, footer, floating WhatsApp button, cookie bar, toast region and the cart drawer mount point (the drawer itself comes in change 05).
- Six sections, rendered in this order:
  1. `sections/01-announcement-bar`: optional one-line bar driven by `Settings.announcement_text`.
  2. `sections/02-header`: wordmark + "Independent KEDI Distributor" lockup, desktop nav, cart button, WhatsApp button.
  3. `sections/03-mobile-menu`: full-height menu for small screens.
  4. `sections/04-footer`: navigation columns, contact, hours, socials, independent-distributor statement, short health disclaimer, legal links.
  5. `sections/05-floating-whatsapp`: persistent bottom-right WhatsApp button.
  6. `sections/06-cookie-consent`: consent bar controlling analytics (change 07 reads it).
- Navigation data in `src/lib/site-nav.ts` (typed, from `docs/routes-and-sitemap.md`).

## Capabilities

### New Capabilities

- `site-shell/layout`: the page frame, skip link and landmark structure.
- `site-shell/announcement-bar`: optional announcement from the Sheet.
- `site-shell/header`: brand lockup, navigation and header actions.
- `site-shell/mobile-menu`: small-screen navigation.
- `site-shell/footer`: footer content and legal statements.
- `site-shell/floating-whatsapp`: persistent WhatsApp entry point.
- `site-shell/cookie-consent`: consent capture that gates analytics.

## Impact

- Depends on 00, 01. Reads `Settings` (opening hours, announcement) through the catalog helpers from change 04. Until 04 lands, use the fixture.
- Client inputs: brand name/wordmark, WhatsApp number, phone, email, socials, opening hours, `[Registered Business Name]`.
- The cart button shows a count of 0 and opens nothing until change 05 wires the cart store; it renders as a link to `/shop` until then.

## Context

Reference: Rixl landing `src/components/layout/site/{layout,footer,header/*}.tsx`. Rixl uses a mega-menu; we don't need one (only 5 top items). Pages call `<SiteLayout>` the same way Rixl views do.

## Goals / Non-Goals

**Goals**

- Shell adds < 15 KB gzip of client JS (mobile menu, cart count, cookie bar, floating button).
- The header is sticky and 64px tall on mobile and 72px on desktop.

**Non-Goals**

- Search in the header (search lives on `/shop`).
- Language switcher.

## Decisions

### Layout structure

```
<a href="#main" class="skip-link">Skip to content</a>
<AnnouncementBar/>            // 01, optional
<SiteHeader/>                 // 02 (contains MobileMenu trigger → 03)
<main id="main" tabIndex={-1}>{children}</main>
<SiteFooter/>                 // 04
<FloatingWhatsApp/>           // 05
<CookieConsent/>              // 06
<ToastRegion/>                // from 01
<CartDrawerMount/>            // filled by change 05
```

- `SiteLayout` props: `children`, `hideFloatingWhatsApp?: boolean | "mobile"` (`"mobile"` is used on the product page, where the mobile sticky buy bar includes WhatsApp), `className?`.
- Body background `canvas`. Pages control their own section tones.
- The skip link is visually hidden until focused, then shows top-left as a `primary` button.

### Navigation data

`src/lib/site-nav.ts` exports `primaryNav`, `mobileNav`, `footerColumns` and `legalLinks` as typed arrays of `{label, href}` (see `docs/routes-and-sitemap.md`). The active state is computed from `useLocation()`: exact match, or a prefix match for `/shop`, `/products`, `/learn`.

### Client islands

Only these shell parts hydrate interactive state: mobile menu toggle, cart count (localStorage), cookie bar, floating button visibility. Everything else is static markup.

## Risks / Trade-offs

- [Cart count needs localStorage, so the prerendered HTML shows 0] → Render the count badge only after hydration (`useHydrated()` hook), so there is no flash of a wrong number.
- [Announcement text changes need a publish] → Acceptable; the nightly rebuild also picks it up.

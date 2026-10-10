## 1. Layout

- [x] 1.1 `src/lib/site-nav.ts` with typed nav arrays + test that every href is a route listed in `docs/routes-and-sitemap.md`
- [x] 1.2 `src/lib/use-hydrated.ts` hook + test
- [x] 1.3 `SiteLayout` with skip link, landmarks and `hideFloatingWhatsApp`; test: skip link targets `#main`, exactly one `main`, `header` and `footer`
- [x] 1.4 Replace the holding page wrapper in `src/routes/index.tsx` with `SiteLayout`

## 2. Sections

- [x] 2.1 `sections/01-announcement-bar` complete
- [x] 2.2 `sections/02-header` complete
- [x] 2.3 `sections/03-mobile-menu` complete
- [x] 2.4 `sections/04-footer` complete
- [x] 2.5 `sections/05-floating-whatsapp` complete
- [x] 2.6 `sections/06-cookie-consent` complete

## 3. Verification

- [x] 3.1 `vp run lint`, `vp test --run`, `vp run build` pass
- [ ] 3.2 Manual: 360px — header fits on one row, menu opens/closes, floating button doesn't cover the cookie bar buttons; 1280px — nav items and both header actions visible
- [ ] 3.3 Keyboard: skip link → main; tab order header → main → footer; menu traps focus
- [ ] 3.4 Lighthouse mobile on `/`: Accessibility ≥ 95

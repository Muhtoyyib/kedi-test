## 1. Build

- [x] 1.1 `BrandLockup` (SVG or text fallback + subline); test: subline text present, link to `/`
- [x] 1.2 `DesktopNav` with active state from location; test: `aria-current` on `/shop` and on `/shop/digestive-health`
- [x] 1.3 `CartButton` with hydrated badge (count prop for now); test: hidden at 0, label includes count
- [x] 1.4 `MenuButton` (`aria-expanded`/`aria-controls`)
- [x] 1.5 `SiteHeader` composing them per breakpoint; WhatsApp actions call `track`
- [x] 1.6 Test: WhatsApp link href matches `buildWhatsAppLink(generalChatMessage())` (import from change 05's `src/lib/whatsapp`; if 05 is not merged yet, add `src/lib/whatsapp/link.ts` + `messages.ts` here with tests, and 05 extends them)

## 2. Verify

- [ ] 2.1 360px: no overflow; lockup subline readable; all four icons ≥ 44px
- [ ] 2.2 1024px and 1280px: everything on one line

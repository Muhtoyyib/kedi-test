## Layout

`bg-ink text-white/90`, `pt-14 pb-28 md:pb-14` (the extra bottom padding on mobile keeps content clear of the floating WhatsApp button).

**Top block** (mobile stacked; lg: 4 columns of 12, then 8 for the link columns):

- Lockup in white (wordmark inverted, or the text fallback in white) + subline "Independent KEDI Distributor" in `text-brand-muted`.
- Promise line `text-white/80`: "Genuine KEDI products, real guidance and follow-up you can count on — in [City] and beyond."
- `Button variant="whatsapp"` "Chat on WhatsApp" (tracks `whatsapp_chat_click {location:"footer"}`).

**Link columns** (mobile: 2×2 grid; md: 4 columns), headings `text-eyebrow text-sun uppercase tracking-[0.12em]`, links `text-white/85 hover:text-white underline-offset-4 hover:underline`, 32px row spacing:

- **Shop**: every active category (from the catalog, sorted) + "All products"
- **Learn & events**: Seminars, Learn, Customer stories
- **Company**: About us, Business opportunity, Refer a friend, FAQ, Contact
- **Legal**: Privacy policy, Terms of use, Health disclaimer, Delivery & returns

**Contact block** (`grid gap-3`, icons in `text-sun`): `MapPin` address · `Clock` hours · `Phone` phone (`tel:`) · `Mail` email (`mailto:`). Social icons row (44px, `aria-label="[Brand Name] on Instagram"` etc., `rel="noopener"`, tracks `outbound_social`).

**Bottom block** (`border-t border-white/15 pt-6 mt-10 text-sm text-white/70 space-y-2`):

1. "[Brand Name] is an independent distributor of KEDI Healthcare products and is not the official KEDI company."
2. "Food supplements are not medicines. Not intended to diagnose, treat, cure or prevent any disease. [Full disclaimer](/health-disclaimer)"
3. "© {year} [Registered Business Name]. All rights reserved." (year from build time).

## Accessibility

- `<footer>` containing `<nav aria-label="Footer">`.
- Link colours on `ink`: `white/85` ≈ 11:1; `brand-muted` 7.65:1; `sun` 10.77:1.

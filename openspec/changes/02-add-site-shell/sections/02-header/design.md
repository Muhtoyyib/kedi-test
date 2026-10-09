## Layout

**Mobile (< 768px)**, height 64px, `px-4`, `bg-canvas/95 backdrop-blur border-b border-line`, sticky `top-0 z-40`:

```
[Lockup ..............] [Cart] [WA] [☰]
```

- Lockup: wordmark (24px tall) + subline below in `text-xs font-semibold text-brand-strong` "Independent KEDI Distributor". If the client has no SVG wordmark, render `siteConfig.name` in `text-lg font-extrabold text-ink`, with a 10px `sun` half-disc mark before it.
- Cart: 44×44 ghost icon button (`ShoppingBag`), badge top-right (`bg-sun text-ink text-xs font-bold min-w-5 h-5 rounded-full`). `aria-label="Cart, {n} items"`.
- WA: 44×44 round button `bg-whatsapp` with `WhatsAppIcon` in `whatsapp-ink`, `aria-label="Chat with us on WhatsApp"`.
- Menu: 44×44 ghost icon button (`Menu`), `aria-expanded`, `aria-controls="mobile-menu"`.

**Desktop (≥ 1024px)**, height 72px, container `max-w-6xl`:

```
[Lockup]   Shop  Seminars  Learn  Stories  About        Contact  [Cart] [Chat on WhatsApp]
```

- Nav links `text-base font-semibold text-ink hover:text-brand-strong`. Active: `text-brand-strong` plus a 4px `bg-sun` underline bar, `aria-current="page"`.
- "Chat on WhatsApp": `Button variant="whatsapp" size="sm"`.
- **Tablet (768–1023px):** mobile layout, with the full "Chat on WhatsApp" label replacing the WA icon button.

## Behaviour

- WhatsApp link: `buildWhatsAppLink(generalChatMessage())` (`docs/whatsapp-messages.md` §3). Tracks `whatsapp_chat_click {location:"header"}`.
- Cart button: before change 05 it links to `/shop`. After 05 it opens the cart drawer and tracks `view_cart`.
- The cart badge is hidden when the count is 0 or before hydration.
- Lockup links to `/` with `aria-label="{Brand name} home"`.

## Content

- Subline (exact): "Independent KEDI Distributor".
- Nav labels: "Shop", "Seminars", "Learn", "Stories", "About", "Contact".

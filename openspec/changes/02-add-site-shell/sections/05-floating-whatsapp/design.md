## Layout

- Fixed `bottom-4 right-4` (`md:bottom-6 md:right-6`), `z-30` (below header z-40, drawer z-50, cookie bar z-45). Respects the safe area: `bottom-[max(1rem,env(safe-area-inset-bottom))]` (layout arbitrary value, allowed).
- 56×56 circle `bg-whatsapp shadow-overlay`, `WhatsAppIcon` 28px in `whatsapp-ink`. `aria-label="Chat with us on WhatsApp"`.
- Bubble: to the left of the button, `bg-canvas text-ink text-sm font-semibold shadow-card rounded-card px-4 py-3 max-w-56`, with a small close `X` (32px hit area, `aria-label="Hide message"`). Text: "Need help choosing? Chat with us". Tapping the text opens WhatsApp.
- When the cookie bar is visible on mobile, the button moves up above it (`bottom` offset = bar height via a CSS variable set by the cookie bar: `--cookie-bar-h`).

## Behaviour

- Link: general chat message. `track({event:"whatsapp_chat_click", location:"floating", context: pathname})`.
- Bubble timer: starts after hydration. It only shows if the visitor has not opened WhatsApp, the cart or the menu this session (`sessionStorage["wa-bubble-seen"]`).
- Hidden while the cart drawer or mobile menu is open.
- No bounce, pulse or shake animation. The bubble fades in over 150ms.

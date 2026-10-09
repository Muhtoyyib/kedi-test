## Layout

- `fixed inset-x-0 bottom-0 z-30 bg-canvas border-t border-line shadow-overlay px-4 py-3`, plus safe-area padding.
- Row: 40px thumbnail · name (1 line, truncated) over price (`font-bold`) · `AddToCartButton variant="sticky"` · 48px WhatsApp icon button (`aria-label="Ask about {name} on WhatsApp"`).
- Out of stock: the add button is replaced by `Button whatsapp size=md` "Ask when back in stock", and the icon button is hidden.
- Hidden at md+ (`md:hidden`).

## Behaviour

- IntersectionObserver on the purchase panel's Add to cart button: the bar is visible when that button is **not** visible and the user has scrolled past it (not before reaching it). It slides up over 200ms (none under reduced motion).
- `aria-hidden` and `inert` while hidden.
- Hidden while the cart drawer is open, and while the cookie bar is showing (the cookie bar takes priority; the bar appears after the choice).

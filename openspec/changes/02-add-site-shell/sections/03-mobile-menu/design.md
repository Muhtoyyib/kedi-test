## Layout

- Full-screen `bg-canvas`, `id="mobile-menu"`, slides from the right in 200ms (no slide under reduced motion).
- Top row (64px) mirrors the header: lockup left, close button (`X`, 44×44, `aria-label="Close menu"`) right.
- List: each item is a 56px-tall row, `text-lg font-semibold text-ink`, `border-b border-line`, with a `ChevronRight` in `text-text-muted`. The active item has `text-brand-strong` and a 4px `bg-sun` bar on the left.
- Order: Shop · Seminars · Learn · Customer stories · Business opportunity · Refer a friend · About us · FAQ · Contact.
- Below the list (`p-4 space-y-3`):
  - `Button variant="whatsapp" fullWidth size="lg"` "Chat on WhatsApp"
  - `Button variant="secondary" fullWidth` "Call {phone.display}" (`tel:` link; tracks `phone_click {location:"mobile_menu"}`)
  - Opening hours line with a `Clock` icon, `text-sm text-text-muted`
  - Social icon row (Instagram, Facebook, TikTok, YouTube) as 44px ghost icon links with `aria-label`s

## Behaviour

- Opening locks body scroll and moves focus to the close button. Esc and close return focus to the menu button.
- Tapping a link closes the menu (the route change also closes it).
- Rendered only after the menu button is pressed (not in the prerendered HTML). The footer gives no-JS users the same links.

## Layout

- Fixed bottom, full width on mobile (`inset-x-0 bottom-0`), and a 420px card at bottom-left from md. `bg-canvas border-t border-line shadow-overlay p-4`, `z-45` (custom z-index token `--z-cookie`; layout arbitrary value allowed).
- Text (`text-sm text-text-body`): "We use cookies to understand which pages help people and to measure our ads." then "[Privacy policy](/privacy)" as a `link` button.
- Buttons row: `Button variant="primary" size="sm"` **Accept** · `Button variant="secondary" size="sm"` **Decline**. Equal width on mobile (`grid grid-cols-2 gap-3`).
- Sets the CSS variable `--cookie-bar-h` on `<html>` to its height, so the floating WhatsApp button can move above it; removed on close.

## Behaviour

- Not in prerendered HTML. It appears after hydration if no valid choice is stored, so the bar never flashes for returning visitors.
- **Accept** → store `{analytics:true}` and emit change; analytics scripts load (change 07). **Decline** → store `{analytics:false}`; nothing loads.
- Stored choices expire after 182 days, after which the visitor is asked again.
- Footer "Cookie settings" clears the stored choice and shows the bar again. Withdrawing consent after accepting removes `_ga*`, `_fbp` and `_clck`/`_clsk` cookies on this domain and reloads the page.
- `role="region"`, `aria-label="Cookie consent"`. Focus is **not** moved to it (it is non-blocking), but it is reachable by Tab right after the skip link.

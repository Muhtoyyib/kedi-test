## Layout

- A full-width bar directly under the header (not covering it), `bg-leaf-soft border-b border-line`, `py-3`, container width.
- Text: `font-semibold text-ink` "Did your order KD-261012-7F3K send on WhatsApp?"
- Actions (wrap on mobile, 40px buttons): `Button primary size=sm` "Yes, it's sent" · `Button whatsapp size=sm` "Open WhatsApp again" · `Button link` "Edit order".
- After "Yes": the bar changes for 4 s to "Thank you! We'll reply shortly to confirm stock, delivery fee and payment." with a `CheckCircle2` icon in `leaf-strong`, then disappears.

## Detection

- Listen to `pageshow` (with `persisted` true → bfcache restore) and `visibilitychange` → visible.
- On any page load, read the pending marker from sessionStorage, falling back to localStorage `pending-order:last` (sessionStorage is lost when Android kills the tab).
- Show only if the pending marker is < 24 h old and the cart hash still matches (if the customer changed the cart, show the drawer's normal state instead).

## Behaviour

- "Open WhatsApp again" rebuilds the link from the stored order (same order ID), so it does **not** send a second beacon.
- "Edit order" opens the drawer. Sending again creates a **new** order ID (the edited order is a different order). The old one remains "Started on website" and the distributor sees both.

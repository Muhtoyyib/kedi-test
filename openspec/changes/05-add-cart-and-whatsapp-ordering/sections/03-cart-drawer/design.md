## Layout (top to bottom)

1. **Header row** (sticky inside the drawer): `text-h3` "Your order" + `text-text-muted` "({count} items)", close button (`X`, `aria-label="Close cart"`).
2. **Removed-items notice** (only when selectors report removed products): `Notice tone="info"` "1 item is no longer available and was removed."
3. **Lines** (`divide-y divide-line`), each 96px min:
   - 64×64 product image (`rounded-field`, `bg-brand-soft`)
   - name (`font-semibold text-ink`, 2-line clamp) + pack size (`text-sm text-text-muted`)
   - unit price (`Price size=sm`) or "Price to confirm"
   - `QuantityStepper` (compact 40px) and a "Remove" text button (`link` variant, `aria-label="Remove {name}"`)
   - line total right-aligned (`font-bold tabular-nums`)
   - out-of-stock badge if the product went out of stock
4. **Summary** (`bg-surface rounded-card p-4`):
   - "Subtotal" ↔ `formatNaira(subtotal)`; with ask-price lines: "+ items to confirm"
   - "Delivery" ↔ "Confirmed on WhatsApp"
   - Free-delivery hint when the threshold is set and subtotal < threshold: `text-sm text-leaf-strong` "Add {formatNaira(threshold − subtotal)} more for free delivery"
   - `deliveryNote` in `text-sm text-text-muted`
5. **Payment safety** (`Notice tone="sun"`, short form): "We only send payment details from our official WhatsApp number. Never pay into any other account."
6. **Order details form** → section 04.
7. **Send button** → section 05 (sticky at the bottom of the drawer on mobile, with the subtotal repeated on the button's left: "₦49,000 · Send order on WhatsApp").

## Empty state

`ShoppingBag` icon in a `brand-soft` circle, "Your cart is empty", "Browse our products or ask us what suits your routine.", `Button primary` "Shop products" (/shop) and `Button whatsapp` "Ask on WhatsApp".

## Behaviour

- Opening tracks `view_cart {item_count, value}`.
- Steppers update instantly; when the last line is removed, the empty state shows (the drawer stays open).
- The drawer scrolls internally. On mobile the sticky send bar stays visible above the keyboard (`position: sticky; bottom: 0` inside the scroll container).

## Variants

| Variant  | Appearance                                                                                | Behaviour           |
| -------- | ----------------------------------------------------------------------------------------- | ------------------- |
| `card`   | `Button primary size=sm fullWidth` "Add to cart" with `Plus` icon                         | Adds qty 1          |
| `pdp`    | `QuantityStepper` (− qty +, 48px tall, qty 1–20) + `Button primary size=lg` "Add to cart" | Adds the chosen qty |
| `sticky` | `Button primary size=md` "Add to cart" (qty 1)                                            | Adds qty 1          |

- **In cart already** (card/sticky): label "Add another"; under the button `text-sm text-leaf-strong` "In your cart: {qty}".
- **Ask-for-price product:** still addable. Label "Add to order", with helper text under the price "We'll confirm the price on WhatsApp".
- **Out of stock:** replace the control with `Button variant="whatsapp" size=sm` "Ask on WhatsApp" → `outOfStock(product)` message; tracks `whatsapp_chat_click {location:"out_of_stock", context: productId}`.
- **Added state:** the label becomes "Added ✓" with `aria-live="polite"` on a visually hidden status, for 1.5 s. No scale or bounce.
- **Toast:** "Added to cart · {product name}" with action "View cart" (opens the drawer).
- **Limit reached:** toast with the cart-full message from the cart-store spec; the button stays enabled.
- `QuantityStepper`: `−`/`+` are 44px icon buttons with `aria-label="Decrease quantity"`/`"Increase quantity"`; the value is `<output aria-live="polite">`; `−` is disabled at 1, `+` at 20.

## Events

`add_to_cart {item_id, quantity, price, location}` (location = `card` | `pdp` | `sticky_bar`).

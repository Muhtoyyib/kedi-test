## Layout (top to bottom)

1. Category link (`text-eyebrow text-brand-strong`) → `/shop/{slug}`
2. h1 `text-h1 text-ink` — product name
3. `shortBenefit` (`text-lead`)
4. Meta row (`text-sm text-text-muted`, separated by `·`): "{packSize}" · "{Lasts about N weeks}"
5. Price row: `Price size="lg"` + stock badge (`Badge stock` "In stock" / `Badge out` "Out of stock"). Ask-price products: "Ask for price" + helper "We'll confirm the price on WhatsApp".
6. `AddToCartButton variant="pdp"` (stepper + button, full width on mobile; stepper 140px + button flex-1 on md)
7. `Button whatsapp` fullWidth "Ask about this product on WhatsApp" → `productEnquiry(product)`; tracks `whatsapp_chat_click {location:"pdp_ask", context: id}`. Out of stock: this button reads "Ask when it's back in stock" and uses the out-of-stock message; step 6 is hidden.
8. Trust lines (`ul text-sm`, icons in `leaf-strong`):
   - `BadgeCheck` "Genuine KEDI product"
   - `Truck` "Delivery across [City]: fee confirmed on WhatsApp" + link "Delivery info" → `/delivery-and-returns`
   - `MessageCircleHeart` "We'll check in after delivery to help you use it well"

md+: `sticky top-24` within its column, `bg-canvas`.

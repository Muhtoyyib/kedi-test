## Layout

- `SiteSection tone="canvas" spacing="tight"`, `pt-8`.
- `SectionHeader as="h1"`: eyebrow "Shop", title "Genuine KEDI products", description "Prices in Naira. Add what you need to your cart, then send your order on WhatsApp. We'll confirm stock, delivery and payment with you."
- **How ordering works**: `StepList variant="compact"` in a `bg-surface rounded-card p-4` strip, horizontal on md+, vertical on mobile, numbers in `bg-sun text-ink` 28px circles:
  1. "Add products to your cart"
  2. "Send your order on WhatsApp"
  3. "Pay to our business account and we deliver"
- A small `link` button at the end of the strip: "Delivery areas and fees" → `/delivery-and-returns`.

On category pages, section 06 replaces the title block, but the strip stays.

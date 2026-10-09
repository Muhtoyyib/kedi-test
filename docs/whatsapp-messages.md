# WhatsApp Messages (Pre-filled)

All WhatsApp links are built by `src/lib/whatsapp/link.ts`:

```ts
buildWhatsAppLink(message: WhatsAppMessage): string   // https://wa.me/<digits>?text=<encoded>
```

- `<digits>` = `siteConfig.whatsapp.number` (E.164 without `+`).
- Message text is built by pure functions in `src/lib/whatsapp/messages.ts`, one per kind below. They are unit tested, and none of them include personal data the visitor didn't type.
- Links open in the **same tab** (`target` omitted) on mobile. On desktop they open in a new tab (`target="_blank" rel="noopener"`), so the site stays open next to WhatsApp Web.
- Encoded URLs must stay under 2,000 characters. The order builder enforces a 20-line cap (change `05`).

## 1. Order (from the cart)

```
Hello [Brand Name]! I'd like to place an order.

Order ID: KD-261012-7F3K
• Product A × 2 — ₦37,000
• Product B × 1 — ₦12,000
Subtotal: ₦49,000 (delivery fee to be confirmed)

Name: Ngozi Adeyemi
Delivery area: Ikeja
Referral code: AMAKA-4821
```

- "Ask for price" items show `— price to confirm`, and the subtotal line becomes `Subtotal: ₦12,000 + items to confirm`.
- The referral line is omitted when there is no code.
- If the chosen area is "Other", the line reads `Delivery area: Other — [what they typed]`.

## 2. Ask about a product (product page, out-of-stock card)

```
Hello [Brand Name]! I'd like to ask about Product A (60 capsules).
```

Out of stock variant:

```
Hello [Brand Name]! Product A (60 capsules) shows out of stock. When will it be available?
```

## 3. General chat (header, floating button, hero, final CTA, footer)

```
Hello [Brand Name]! I'd like some advice on which KEDI product is right for me.
```

## 4. Seminar question (seminars page FAQ, no-upcoming state)

```
Hello [Brand Name]! I have a question about the free wellness seminar.
```

## 5. Business opportunity

```
Hello [Brand Name]! I'm interested in becoming a KEDI distributor and would like to learn more.
```

## 6. Contact page

```
Hello [Brand Name]! I'm contacting you from your website.
```

## 7. Story submission (stories page)

```
Hello [Brand Name]! I'd like to share my experience with your service.
```

## 8. Referral share (sent by the customer to a friend)

```
I buy my KEDI wellness products from [Brand Name] in [City]. They explain everything and follow up properly. Use my link to get {friendReward} on your first order: https://[domain]/?ref=AMAKA-4821
```

`{friendReward}` comes from `Settings.referral_friend_reward_text`. Shared through `https://wa.me/?text=…` (no number, so WhatsApp asks which contact to send to).

## Quick replies (distributor side, for the Operations Playbook)

These live in the WhatsApp Business App, not on the site. They are listed in the business plan (section 4.2): `/price`, `/pay`, `/delivery`, `/seminar`, `/howtouse`, `/day3`, `/day14`, `/reorder`, `/refer`, `/winback`. The `/pay` text must match the payment safety text in `docs/copy-and-compliance.md` §6.

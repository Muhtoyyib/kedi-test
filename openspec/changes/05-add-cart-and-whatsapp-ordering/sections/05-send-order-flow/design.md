## Click handler (synchronous until navigation)

```
onClick:
  errors = validateDetails(...)            → if errors: show, focus first, return
  now = new Date()
  orderId = createOrderId(now, crypto.getRandomValues)
  payload = buildOrderPayload(cart, details, context, orderId, now)
  text = orderMessage(payload, siteConfig.name)
  link = buildWhatsAppLink(text)
  status = sendOrder(payload)               // sendBeacon(url, new Blob([json], {type:"text/plain;charset=utf-8"}))
  savePending({orderId, at: now, cartHash})
  saveDetails(details)
  track({event:"whatsapp_order_sent", order_id, item_count, value, has_referral})
  if isDesktop(): window.open(link, "_blank", "noopener")   // still inside the user gesture
  else: location.href = link
```

- **Order ID:** `KD-` + `YYMMDD` (Africa/Lagos) + `-` + 4 characters from `23456789ABCDEFGHJKMNPQRSTVWXYZ` (no 0/O/1/I/L/U), using `crypto.getRandomValues`. Example `KD-261012-7F3K`. About 1.6% chance of a same-day collision at 10,000 orders/day, effectively zero at this scale; the Apps Script dedupe treats a collision as a duplicate, and the distributor still sees the WhatsApp message.
- **Message:** exactly `docs/whatsapp-messages.md` §1. Line format `• {name} × {qty} — {formatNaira(line)}`. A name containing an emoji or `*`/`_` is sent as-is (WhatsApp formatting is acceptable).
- **Button:** `Button variant="whatsapp" size="lg" fullWidth` with the label "Send order on WhatsApp" and, on mobile, the subtotal before it. While processing (a few ms) it shows `loading`, to prevent double taps.
- **Context:** `page` = path where the cart was opened; UTMs from `src/lib/attribution.ts` (change 07; empty until then).

## Endpoint unavailable

If `VITE_APPS_SCRIPT_URL` is empty or `sendBeacon` and `fetch` both throw, `status = "unavailable"`, and WhatsApp still opens. The distributor gets the message; the Sheet does not. A console warning appears in dev only.

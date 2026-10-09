## Layout

Directly below the code result, `grid gap-3`:

- `Button whatsapp lg fullWidth` "Share on WhatsApp" → `https://wa.me/?text={encoded referralShareMessage(code, friendReward)}`
- `Button secondary fullWidth` "Copy link" (toast "Link copied")
- `Button ghost fullWidth` "Copy code" (toast "Code copied")
- `Button ghost fullWidth` "More ways to share" (only if `navigator.share` exists)
- Tip (`text-sm text-text-muted`, `Lightbulb` icon): "Tip: post your link on your WhatsApp Status. Friends who are interested will tap it."
- Message preview (`details` "See the message"): the exact text that will be sent.

Tracking: `referral_link_shared {method}` for each.

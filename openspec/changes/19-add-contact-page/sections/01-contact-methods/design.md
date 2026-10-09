## Layout and copy

`SiteSection tone="brand-soft" spacing="tight"`: eyebrow "Contact", h1 "We're here to help", description "The fastest way to reach us is WhatsApp. We usually reply within 1 hour during opening hours."

Cards (mobile stacked; md 3 columns):

1. **WhatsApp** (`Card` with `border-2 border-whatsapp`): `WhatsAppIcon` in a whatsapp circle, "Chat on WhatsApp", `{whatsapp.display}`, `Button whatsapp fullWidth` "Start a chat" (contact message; location `contact`).
2. **Call**: `Phone` icon, "Call us", `{phone.display}`, `Button secondary fullWidth` "Call now" (`tel:`; `phone_click {location:"contact"}`).
3. **Email**: `Mail` icon, "Email us", `{email}`, `Button secondary fullWidth` "Send an email" (`mailto:`), with "We reply within one working day."

Socials row under the cards: "Follow us" + 44px icon links (Instagram, Facebook, TikTok, YouTube, WhatsApp Channel).

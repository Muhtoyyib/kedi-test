## Layout

Centred block, `py-12`, max-w-md: 64px `brand-soft` circle with `SearchX` (no results) or `PackageOpen` (empty category) icon in `brand-strong`; `text-h3` title; body; actions stacked on mobile, inline on md.

## Copy (exact)

**No results**

- Title: "No products match "{term}""
- Body: "Check the spelling, try a shorter word, or ask us. It may be listed under a different name."
- Actions: `Button secondary` "Clear search" · `Button whatsapp` "Ask us on WhatsApp" (search enquiry message; tracks `whatsapp_chat_click {location:"shop_no_results", context: term}`)

**Empty category**

- Title: "Nothing in {category} right now"
- Body: "New stock arrives regularly. Ask us what's available or browse everything else."
- Actions: `Button primary` "See all products" · `Button whatsapp` "Ask on WhatsApp"

The search term in the analytics context is trimmed to 40 characters and lower-cased.

## Layout

- `SiteSection tone="canvas"`; `CtaBand` = `rounded-panel bg-ink text-white p-8 md:p-12`, with a `SunArc` (md) top-right, partly visible.
- Mobile: centred text; buttons stacked full width. md+: text left (max-w-xl), buttons right.

## Copy (exact)

- Title (`text-h2 text-white`): "Not sure what you need?"
- Text (`text-lead text-white/85`): "Tell us a little about your routine and we'll point you to the right product, or tell you honestly if you don't need one."
- Primary: `Button whatsapp lg` "Chat with us on WhatsApp" → general chat; tracks `whatsapp_chat_click {location:"final_cta"}`
- Secondary: `Button sun lg` "Join the free seminar" → `/seminars#register`
- Small print (`text-sm text-white/70`, `Clock` icon in sun): "We usually reply within 1 hour, {openingHours}." If opening hours are missing: "We usually reply within 1 hour during business hours."

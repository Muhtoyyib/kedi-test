## Layout

**Mobile (360–767):** single column, `pt-6 pb-10`.

```
[eyebrow]  ● INDEPENDENT KEDI DISTRIBUTOR · [CITY]
[H1]       Your trusted KEDI wellness partner in [City]
[lead]     Genuine products, real guidance and follow-up from people who actually check in on you.
[button]   Shop products                       (primary, lg, full width)
[button]   Join this week's free seminar       (sun, lg, full width)
[link]     💬 Not sure what you need? Chat with us on WhatsApp   (WhatsAppIcon + link variant, text-ink)
[small]    📍 Delivering across [Area 1], [Area 2], [Area 3] and beyond
[image]    distributor photo 4:5, rounded-panel, with SunArc (lg) behind its lower half
```

**md (768+):** two columns `grid-cols-[1.1fr_0.9fr] gap-10 items-center`. Text left, image right (5:4 → use 4:5 crop at md; 5:4 at lg), `py-16`. Buttons inline (`flex gap-3`, auto width).

**lg (1024+):** H1 at `md:text-display` size; image column max-w-xl.

## Copy (exact)

- Eyebrow: "Independent KEDI Distributor · [City]"
- H1: "Your trusted KEDI wellness partner in [City]"
- Lead: "Genuine products, real guidance and follow-up from people who actually check in on you."
- Primary: "Shop products" → `/shop`
- Seminar button label (from `heroSeminarLabel(next, now)`):
  - next seminar within the next 7 days → "Join this week's free seminar"
  - next seminar later → "Join our next free seminar"
  - none → "See upcoming seminars"
  - target `/seminars#register`
- WhatsApp link: "Not sure what you need? Chat with us on WhatsApp" → general chat message; tracks `whatsapp_chat_click {location:"hero"}`
- Area line: "Delivering across {serviceAreas joined with commas and 'and'} and beyond" with a `MapPin` icon in `brand-strong`
- Image alt: "[Distributor Name] with KEDI wellness products"

## Visual details

- H1 `text-ink font-extrabold text-balance`; the city word is wrapped in `<span class="relative">` with a 6px `bg-sun` underline bar beneath it (`absolute inset-x-0 bottom-1 h-1.5 -z-10 rounded-full`).
- The image wrapper is `relative`; `SunArc` sits `absolute -bottom-6 left-1/2 -translate-x-1/2 w-[85%]` behind it (layout arbitrary values allowed).
- No background pattern or gradient.

## Behaviour

- The seminar label is computed at build time and re-evaluated after hydration (prevents a stale "this week" label).
- The seminar button tracks `seminar_register_click {seminar_id, location:"home_hero"}` only when a seminar exists.

## Layout

`SiteSection tone="canvas"`. Inside: a `rounded-panel bg-brand text-white p-6 md:p-10 relative overflow-hidden`, with a large `SunArc` peeking from the bottom-right corner (`aria-hidden`, 40% visible).

**Mobile:**

```
[Date block: bg-sun text-ink rounded-card 72×80 — "SAT" / "12" / "OCT"]
[eyebrow text-sun]   THIS WEEK'S FREE SEMINAR   (or "NEXT FREE SEMINAR")
[h2 white]           Better digestion, better days
[meta white/90]      🕓 4:00 PM – 5:30 PM WAT  ·  📍 [Venue] / 💻 Online (YouTube Live)
[summary white/90]   2 lines max
[button sun lg full] Register free
[link white]         See all seminars →
```

**md+:** date block left (96×108), text centre, buttons right (stacked).

Text on `brand`: white (4.51:1), and all body text in this panel is ≥ 18px (large), so contrast is comfortable. Meta icons in `text-sun`.

## SeminarCard API

```ts
interface SeminarCardProps {
  seminar: Seminar;
  variant: "banner" | "list"; // banner = this section; list = seminars page upcoming list
  registerHref: string; // "/seminars#register" here; Luma URL on the seminars page list
  location: string; // analytics location
}
```

## Behaviour

- Eyebrow "This week's free seminar" if it starts within 7 days, else "Next free seminar".
- Register → `/seminars#register`; tracks `seminar_register_click {seminar_id, location:"home_banner"}`.
- On hydration, recompute `getNextSeminar(new Date())`. If it differs from the prerendered one, re-render with the new seminar or the empty state.
- **Empty state** (same panel, no date block): eyebrow "Free wellness seminars", title "New seminar dates are coming soon", text "Get a notification as soon as the next date is set.", `Button sun` "Get notified of every seminar" (Luma calendar URL, new tab; tracks `calendar_subscribe_click`), and a `link` button "Ask us on WhatsApp" (seminar question message).

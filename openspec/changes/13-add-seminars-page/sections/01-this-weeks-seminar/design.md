## Layout

`SiteSection tone="brand-soft"`, `pt-8 pb-12`. md+: two columns (text left; date card right).

```
[eyebrow]   ● THIS WEEK'S FREE SEMINAR
[h1]        Better digestion, better days
[summary]   lead text (Sheet summary)
[badges]    [FREE] (Badge offer: sun) [In person] or [Online] (Badge brand)
[meta list] 📅 Saturday, 12 October
            🕓 4:00 PM – 5:30 PM WAT (1 hr 30 min)
            📍 [Venue]  — link "Get directions" (Google Maps search URL; physical only)
            💻 Online: YouTube Live — "Link sent after you register" (online only)
            👥 Who should attend: {audience}
[buttons]   Register free (primary lg) · Share with a friend (secondary; native share or WhatsApp share)
```

Date card (md+ right column): `bg-canvas rounded-panel shadow-card p-6` with a large date block (sun) and a countdown line "Starts in 2 days" / "Starts today at 4:00 PM" / "Starting soon", computed on the client (no ticking timer).

## Behaviour

- Register: smooth-scroll to `#register`, then trigger the embed load (section 02) and track `seminar_register_click {seminar_id, location:"seminar_hero"}`.
- Share: `navigator.share({title, text, url: /seminars})` if available, else open `https://wa.me/?text=` with "Join me at a free wellness seminar: {topic}, {date} {time}. Register here: {url}". Tracks `seminar_share {method: "native_share" | "whatsapp"}`.
- **No upcoming seminar:** eyebrow "Free wellness seminars", h1 "Our next seminar date is coming soon", text "We run a free wellness seminar most weeks. Get notified as soon as the next date is set.", buttons `sun` "Get notified of every seminar" (Luma calendar) and `whatsapp` "Ask us on WhatsApp" (seminar question message).

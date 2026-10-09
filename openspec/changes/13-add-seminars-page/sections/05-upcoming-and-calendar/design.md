## Layout

- `SiteSection tone="surface"`, h2 "Coming up".
- List: `SeminarCard variant="list"`: date block (sun, 64px) · topic (h3) · date, time, format · `Button secondary sm` "Register" → `lumaUrl` (new tab), tracking `seminar_register_click {seminar_id, location:"upcoming_list"}`.
- If there are no later seminars: the list is replaced by the text "More dates will be added soon."
- **Calendar panel** (`rounded-panel bg-ink text-white p-6`): `CalendarDays` icon (sun), title "Never miss a seminar", text "Subscribe to our seminar calendar and Luma will email you whenever a new date is added.", `Button sun` "Get notified of every seminar" → `siteConfig.luma.calendarUrl` (new tab; tracks `calendar_subscribe_click`), plus a `link` (white) "Or join our WhatsApp Channel" → `socials.whatsappChannel`.

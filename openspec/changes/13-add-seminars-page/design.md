## Decisions

### Data

`const next = getNextSeminar(now)`, `const upcoming = getSeminars().filter(scheduled & future).slice(1, 5)`, `const highlights = getHighlights()`, `const faqs = getFaqs({page:"seminars"})`, `const host = about.host`. Sections 01, 02 and 05 re-evaluate `now` on the client (see change 04 §4).

### Meta

- Title: "Free weekly wellness seminars | {Brand}"
- Description: "Join our free weekly wellness seminar in {City} or online. Learn practical health habits, ask questions and meet the team. Register in one minute."
- JSON-LD: one `Event` per upcoming scheduled seminar (`eventStatus` EventScheduled, `eventAttendanceMode` Offline/Online, `location` Place or VirtualLocation, `organizer` = the business, `offers` `{price: 0, priceCurrency: "NGN", availability: InStock, url: lumaUrl}`, `isAccessibleForFree: true`).

### Why Luma is click-to-load

The Luma iframe is ~400 KB+ of third-party JS. Loading it only when the visitor taps "Register free" (or when `#register` is the URL hash on arrival) keeps the page fast. The tap also gives a reliable `seminar_register_click` signal.

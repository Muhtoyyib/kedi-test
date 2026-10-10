## 1. Build

- [x] 1.1 `src/lib/announcement.ts`: `hashText`, `isDismissed(storage, text, now)`, `dismiss(storage, text, now)` + unit tests (7-day expiry, changed text shows again)
- [x] 1.2 `AnnouncementBar` component per design
- [x] 1.3 Tests: hidden when no announcement; renders link when href set; dismiss hides it and persists; changed text reappears

## 2. Verify

- [ ] 2.1 360px: text wraps to at most 2 lines and never sits under the close button

## 1. Build

- [ ] 1.1 Extend `pending.ts`: store `{orderId, at, cartHash, message}` in sessionStorage and localStorage; `readPending(now)` with 24 h expiry + tests
- [ ] 1.2 `ReturnBanner` per design, mounted in `SiteLayout` below the header
- [ ] 1.3 Tests: shows on `pageshow` persisted; "Yes" clears cart + marker and shows thanks; "Open WhatsApp again" uses the stored message and does not call the beacon; expired marker hides; changed cart hides

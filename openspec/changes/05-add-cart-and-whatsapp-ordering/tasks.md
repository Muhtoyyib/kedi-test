## 1. Sections

- [x] 1.1 `sections/01-cart-store` complete
- [x] 1.2 `sections/02-add-to-cart-controls` complete
- [ ] 1.3 `sections/03-cart-drawer` complete
- [x] 1.4 `sections/04-order-details-form` complete
- [x] 1.5 `sections/05-send-order-flow` complete
- [x] 1.6 `sections/06-return-from-whatsapp` complete

## 2. Integration

- [x] 2.1 Header `CartButton` opens the drawer and shows the live count; `?cart=open` opens the drawer on load
- [x] 2.2 Drawer chunk is lazy-loaded on first open or on `?cart=open`; verify the home route JS budget (< 120 KB gzip)

## 3. Verification

- [x] 3.1 `vp run lint`, `vp test --run`, `vp run build` pass
- [ ] 3.2 Real-device test (Android Chrome over throttled 3G): add 2 products → send → WhatsApp opens with the exact message → the Sheet has the order with a matching ID within 10 s
- [ ] 3.3 Repeat with airplane mode on after tapping send: WhatsApp still opens (offline queue in WhatsApp); the order appears in the Sheet only if the beacon was flushed — record the result in the PR
- [ ] 3.4 Desktop Chrome: WhatsApp Web opens in a new tab; the cart stays in the original tab with the return banner
- [ ] 3.5 iOS Safari: same-tab redirect opens the WhatsApp app; coming back shows the return banner

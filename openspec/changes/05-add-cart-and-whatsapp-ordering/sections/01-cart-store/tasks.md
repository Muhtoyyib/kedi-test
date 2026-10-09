## 1. Build

- [ ] 1.1 `types.ts`, `reducer.ts` + exhaustive reducer tests (merge, clamp, 21st line refused, setQty 0 removes)
- [ ] 1.2 `store.ts` with storage parsing, cross-tab sync and server snapshot + tests (corrupt JSON, wrong version, storage event from another tab)
- [ ] 1.3 `selectors.ts` + tests (subtotal ignores ask-price lines, missing product filtered, count)
- [ ] 1.4 `useCart()` hook + test with Testing Library `renderHook`
- [ ] 1.5 Property test (fast-check): any action sequence keeps lines ≤ 20 and every qty within 1..20

## 1. Sections

- [ ] 1.1 `sections/01-thank-you-template` complete
- [ ] 1.2 `sections/02-thank-you-variants` complete
- [ ] 1.3 `sections/03-not-found` complete

## 2. Verification

- [ ] 2.1 `vp run lint`, `vp test --run`, `vp run build` pass; `dist/client/404.html` exists
- [ ] 2.2 `wrangler dev`: `/nope` returns 404 with the not-found page; `/thank-you/contact` has `noindex`

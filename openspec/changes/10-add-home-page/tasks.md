## 1. Page

- [x] 1.1 `src/routes/index.tsx` with `head()` from `buildMeta` (title/description per design) replacing the holding page
- [x] 1.2 `src/features/home/view.tsx` composing the sections in order with tones per the proposal table
- [x] 1.3 Page test: renders all section headings in order with fixture data; hides stories/articles sections when content is empty

## 2. Sections

- [x] 2.1 `sections/01-hero` complete
- [x] 2.2 `sections/02-trust-bar` complete
- [x] 2.3 `sections/03-why-buy-from-us` complete
- [x] 2.4 `sections/04-featured-products` complete
- [x] 2.5 `sections/05-next-seminar-banner` complete
- [x] 2.6 `sections/06-customer-stories-preview` complete
- [x] 2.7 `sections/07-wellness-hub-preview` complete
- [x] 2.8 `sections/08-final-cta` complete

## 3. Verification

- [x] 3.1 `vp run lint`, `vp test --run`, `vp run build` pass
- [ ] 3.2 360×640: the hero headline, both buttons and the WhatsApp link are visible without scrolling
- [ ] 3.3 Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO 100, LCP < 2.5 s
- [ ] 3.4 Every link on the page resolves (no 404s) in the built site — forward links to /seminars, /stories, /learn, /products/* resolve once changes 12–15 land

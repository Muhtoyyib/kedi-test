## 1. Page

- [x] 1.1 Route `seminars.tsx` with meta + Event JSON-LD
- [x] 1.2 `view.tsx` composition; `#register` anchor handling (auto-load the embed when arriving with the hash)
- [x] 1.3 Page tests with fixture schedule: next, upcoming list, empty schedule

## 2. Sections

- [x] 2.1 `sections/01-this-weeks-seminar` complete
- [x] 2.2 `sections/02-luma-registration` complete
- [x] 2.3 `sections/03-what-youll-learn` complete
- [x] 2.4 `sections/04-host` complete
- [x] 2.5 `sections/05-upcoming-and-calendar` complete
- [x] 2.6 `sections/06-past-highlights` complete
- [x] 2.7 `sections/07-seminar-faq` complete

## 3. Verification

- [x] 3.1 `vp run lint`, `vp test --run`, `vp run build` pass
- [ ] 3.2 Real Luma test event: embed loads after tap; registration completes; confirmation email arrives
- [ ] 3.3 Rich Results Test: Event valid for physical and online fixtures
- [ ] 3.4 Lighthouse mobile ≥ 90 performance (Luma not loaded on first paint)

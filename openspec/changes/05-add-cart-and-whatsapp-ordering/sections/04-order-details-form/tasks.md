## 1. Build

- [x] 1.1 `src/lib/order/details.ts`: `validateDetails(input, areas)` returning field errors + normalised phone; `saveDetails`/`loadDetails` + tests
- [x] 1.2 `OrderDetailsForm` per design (fields, area select with fees, other-area toggle, referral pre-fill badge, consent, honeypot)
- [x] 1.3 Tests: each validation message; other-area appears only for Other; referral pre-fill; consent starts unticked even when other details are remembered; first focus tracks `begin_checkout` once; error summary focuses the first invalid field

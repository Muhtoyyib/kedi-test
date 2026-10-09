## 1. Tokens and base

- [ ] 1.1 Install `@fontsource-variable/plus-jakarta-sans`; preload the woff2 in `__root.tsx` head
- [ ] 1.2 Write `src/styles/app.css` tokens and base layer per design §1
- [ ] 1.3 Verify utilities generate (`bg-brand`, `text-whatsapp-ink`, `rounded-card`, `shadow-card`, `text-h2`) and that oxlint `shadcn/no-raw-colors` passes

## 2. Formatting helpers

- [ ] 2.1 `src/lib/format/naira.ts` + tests (0, 999, 18500, 1250000, null)
- [ ] 2.2 `src/lib/format/pack-duration.ts` + tests (1, 7, 14, 28, 30, 45, 60, 90)
- [ ] 2.3 `src/lib/format/seminar-date.ts` (`formatSeminarDate`, `formatSeminarTime`, `isUpcoming(now, startsAt)`) + tests including the WAT midnight boundary
- [ ] 2.4 `src/lib/phone.ts` `normalizeNigerianPhone` and `formatPhoneDisplay` + property tests with `fast-check` (valid prefixes 070, 080, 081, 090, 091 and variants; rejects landlines and wrong lengths)

## 3. Primitives

- [ ] 3.1 `Button` (+ `buttonVariants`) per design §2; test: renders `<a>` with href, loading state is disabled and `aria-busy`, whatsapp variant includes the icon
- [ ] 3.2 `WhatsAppIcon`, `Spinner`, `VisuallyHidden`
- [ ] 3.3 `Badge`, `Notice`, `Card`, `Price` (+ tests for `Price` null → "Ask for price")
- [ ] 3.4 `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `PhoneInput` per design §3; tests: label association, error `aria-invalid` + `aria-describedby`, phone prefix
- [ ] 3.5 `ChipGroup` (single select, `aria-pressed`, arrow-key roving focus); tests
- [ ] 3.6 `Accordion` per design §6; test: works with no JS (rendered HTML contains `details`/`summary`)
- [ ] 3.7 `Drawer` per design §4; tests: focus moves in, Esc closes, focus returns to trigger
- [ ] 3.8 `Toast` region + `useToast`; tests: announces message, replaces previous
- [ ] 3.9 `Breadcrumbs`
- [ ] 3.10 `ResponsiveImage`, `StaticImage`, `VideoEmbed` per design §5; tests: srcset contents, facade swaps to iframe on click and calls `track`
- [ ] 3.11 `Prose` (article typography: h2/h3/p/ul/ol/blockquote/a/img spacing using tokens)
- [ ] 3.12 `Disclaimer` (`health` | `earnings`, exact text from `docs/copy-and-compliance.md`); test checks exact strings

## 4. Marketing blocks

- [ ] 4.1 `SiteSection` (`tone`: canvas | surface | brand-soft | ink; `spacing`: default | tight) — adapt from Rixl
- [ ] 4.2 `SectionHeader` (eyebrow with sun dot, title, description, align, `as`) — adapt from Rixl, using the md type steps
- [ ] 4.3 `SunArc` (aria-hidden SVG half-disc in `sun`, sizes sm/md/lg)
- [ ] 4.4 `CtaBand`, `StepList`, `TrustItem`, `Reveal` (motion, reduced-motion aware)
- [ ] 4.5 Tests for `SectionHeader` heading level and `Reveal` rendering children without motion under reduced motion

## 5. Style guide

- [ ] 5.1 `/styleguide` route per design §9 (404 in production)

## 6. Verification

- [ ] 6.1 `vp run lint`, `vp test --run`, `vp run build` pass
- [ ] 6.2 Check `/styleguide` at 360, 768, 1280px; keyboard through every control; axe DevTools shows no violations
- [ ] 6.3 Contrast spot-check: brand/white, whatsapp-ink/whatsapp, ink/sun, sun-ink/sun-soft, text-muted/surface ≥ 4.5:1

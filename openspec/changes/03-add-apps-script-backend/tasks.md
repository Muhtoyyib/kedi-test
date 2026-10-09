## 1. Project setup

- [x] 1.1 Create `apps-script/` per design §1; `appsscript.json` with timezone Africa/Lagos and webapp settings; esbuild bundle script; `clasp` config
- [x] 1.2 `schema.ts`: every tab name, header list, status list and validation list from `docs/content-model.md`
- [x] 1.3 `sheets.ts` header-indexed helpers + Node fakes for tests

## 2. Workbook

- [x] 2.1 `setupWorkbook()`: creates tabs and headers, Yes/No and status dropdowns, frozen header rows, protected headers, Reorder Queue formulas, Dashboard formulas (weekly leads, registrations, orders started vs paid, revenue, repeat customers, referrals, conversion rates from plan §9)
- [x] 2.2 `onOpen` menu "KEDI Website" with the five items (Publish website, Check content for errors, New article from template, Open last publish run, Send today's to-do email now)
- [x] 2.3 Create the Drive folders and the Article template Doc (design §7); `New article from template` action

## 3. Catalog endpoint

- [x] 3.1 `catalog.ts` + `validate.ts` catalog rules (design §6), output shape = `docs/content-model.md` §2 minus generated images (raw `image_ids` instead)
- [x] 3.2 `images.ts` (`DriveApp.getFileById(id).getBlob()`, size guard 8 MB, returns modifiedTime)
- [x] 3.3 Token check helper (constant-time compare) for `catalog`, `image`, `publish_result`
- [x] 3.4 Tests: valid fixture → payload; each error rule; banned-word warnings

## 3b. Client content

- [x] 3b.1 `content.ts`: Highlights, Videos and Stories parsing with the rules in design §7 + tests (consent-missing story excluded with warning; photo dropped without photo consent; name format; featured > 3; video URL forms)
- [x] 3b.2 `docs.ts` `convertDoc` per design §7. Keep the pure part (`DocNode[]` → `ArticleBlock[]`) separate from `DocumentApp` access, so it can be tested in Node with fake nodes
- [x] 3b.3 Tests for conversion: headings, bold/italic/link runs, lists (ordered/unordered), inline image refs and alt warnings, video-link paragraph, doctor callout boundaries, ignored tables, unsafe link schemes dropped, reading time
- [x] 3b.4 Banned-word check on client content (error outside the doctor callout, allowed inside) + tests
- [x] 3b.5 `?action=doc_image` handler + per-Doc conversion cache
- [x] 3b.6 Validation dialog grouped by tab with plain-English messages

## 4. Intake

- [x] 4.1 `phone.ts` copied from site `src/lib/phone.ts` with the same tests
- [x] 4.2 `orders.ts` per design §2 + tests (duplicate, mismatch, ask-price, upsert rules, referral pending)
- [x] 4.3 `forms.ts` for `contact`, `business_interest`, `seminar_interest` (+ tests: consent required, field limits, upsert source)
- [x] 4.4 `referrals.ts`: `referral_code` registration (same code + same phone → no-op; same code + different phone → `duplicate_flag`), + tests
- [x] 4.5 Rate limit + honeypot + size guard in `router.ts` + tests

## 5. Automation

- [x] 5.1 Installable `onEdit` trigger for Orders status per design §3 + tests on the transition function
- [x] 5.2 `followups.ts` daily email per design §4 (HTML template, WhatsApp link builder, message texts from the plan's quick replies) + tests for which rows appear
- [x] 5.3 `installTriggers()` (daily 07:00, onEdit) callable from the menu once

## 6. Publish

- [x] 6.1 `publish.ts` per design §5 + Publish Log + `publish_result` handler + tests (401 message, error list stops publish)

## 7. Docs and deploy

- [x] 7.1 `apps-script/README.md`: step-by-step for creating the project in the client's account, Script Properties, deploying a new version, rotating tokens
- [ ] 7.2 Deploy to a test Google account; record URL in `.env` and GitHub secrets

## 8. Verification

- [ ] 8.1 `curl "$URL?action=catalog&token=…"` returns valid JSON; wrong token returns `{ok:false, code:"unauthorized"}`
- [ ] 8.2 `curl -X POST -H 'Content-Type: text/plain' -d '{"type":"order",…}' $URL` appends one row; repeating it does not add a second
- [ ] 8.3 Change an order to Paid then Delivered in the Sheet → customer and Reorder Queue update
- [ ] 8.4 Run "Send today's to-do email now" → email arrives with working one-tap links
- [ ] 8.5 Publish from the menu → Actions run starts → Publish Log shows Live

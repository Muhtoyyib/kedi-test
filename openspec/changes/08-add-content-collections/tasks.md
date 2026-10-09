## 1. Repo content

- [ ] 1.1 `source.config.ts` `legal` collection; `src/lib/content/legal.ts` (`getLegalPage`) + tests with the fumadocs collection mock (as in Rixl's vitest config)
- [ ] 1.2 `content/faq.ts` seeded per design §3 + `getFaqs` with token resolution + tests (missing bank details → item omitted)
- [ ] 1.3 `content/about.ts` and `content/business.ts` typed modules + `getAbout`/`getBusinessContent` (placeholders only where `docs/client-inputs.md` lists them)
- [ ] 1.4 `src/components/mdx-components.tsx` for legal pages (`DeliveryTable`, `BankDetails`, `Disclaimer`, `Callout`)

## 2. Rendering client content

- [ ] 2.1 `ArticleBody` per design §2 + tests for every block type (fixture article from change 04): heading IDs, inline marks, internal vs external links, image figure/caption rule, video facade, doctor callout
- [ ] 2.2 Test that a block containing `<script>` text renders as literal text
- [ ] 2.3 `RichText` for story paragraphs + test

## 3. Compliance lint (repo content)

- [ ] 3.1 `scripts/lint-content.ts` using `scripts/lib/compliance.ts` + tests (catches "cures" in faq.ts; allowlisted disclaimer passes) and wire into `ci:build`

## 4. Starter articles

- [ ] 4.1 Draft the three articles in the client's "Website Articles" folder from the template (design §5), with `ready = No`, covers and alt text; send them to the client for approval

## 5. Verification

- [ ] 5.1 `vp run generate && vp test --run && vp run build` pass
- [ ] 5.2 Set one starter article to Ready = Yes in the test Sheet → Publish → the article renders correctly at 360px and 1280px

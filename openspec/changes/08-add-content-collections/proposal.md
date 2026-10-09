## Why

Most content is now edited by the client in the Google Sheet and Google Docs (changes 03 and 04): seminar highlights, videos, customer stories and articles. Two things remain for this change:

1. **Developer-edited content** that changes rarely and needs careful wording: FAQs, About/host text, business-opportunity copy and the legal pages. It needs typed, validated sources.
2. **Safe rendering of client-written articles.** The Google Doc text arrives as typed blocks and must be shown consistently, without ever rendering raw HTML.

## What Changes

- `source.config.ts`: one fumadocs-mdx collection, `legal`, with a strict frontmatter schema (`title`, `description`, `updated`).
- Typed TS modules: `content/faq.ts`, `content/about.ts` (distributor, host, mission, values), `content/business.ts` (opportunity copy).
- Access helpers in `src/lib/content/*`: `getFaqs({page?, group?})` (with `{settings}` token resolution), `getAbout()`, `getBusinessContent()`, `getLegalPage(slug)`.
- **`ArticleBody`** renderer (`src/components/content/article-body.tsx`): turns `ArticleBlock[]` (`docs/content-model.md` §2) into accessible markup using `Prose`, `ResponsiveImage`, `VideoEmbed` and the "When to see a doctor" callout. Also `RichText` for story full-text paragraphs.
- MDX component map for legal pages: `DeliveryTable`, `BankDetails`, `Disclaimer`, `Callout`.
- Build-time content lint for **repo** content (`content/faq.ts`, `content/business.ts`, legal MDX), using the shared banned-word list (`scripts/lib/compliance.ts` from change 04).
- **Starter articles:** three articles drafted by us in Google Docs in the client's "Website Articles" folder, with `ready = No` until the client approves them.

**Removed from the earlier version of this change:** the `learn` and `stories` MDX collections and `content/seminars/highlights.ts`. That content now comes from the Sheet.

## Capabilities

### New Capabilities

- `content/collections`: typed sources for FAQs, About, business and legal content.
- `content/article-rendering`: how client-written article blocks and story text are displayed safely.

## Impact

- Depends on 00, 01 (Prose, media primitives), 04 (catalog types, compliance list, settings for FAQ tokens and the MDX tables).
- Used by 13 (FAQ), 14 (ArticleBody), 15 (RichText), 16, 17, 18, 21.
- Client inputs: bio, mission/values, business details (`docs/client-inputs.md`); approval of the starter articles.

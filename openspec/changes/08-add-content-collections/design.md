## Context

Client content (highlights, videos, stories, articles) is validated in Apps Script (change 03) and again in the build (change 04). It reaches pages as typed catalog data. This change covers the developer-edited content, and the components that render client text safely.

## Goals / Non-Goals

**Goals**

- No raw HTML from client content ever reaches the page.
- Repo content fails the build when it is invalid or makes health claims.

**Non-Goals**

- A content editor UI (Option 2's admin dashboard covers that later).
- MDX for articles or stories.

## Decisions

### 1. Legal collection (`source.config.ts`)

```ts
const legal = defineCollections({
  type: "doc",
  dir: "content/legal",
  schema: z
    .object({
      title: z.string(),
      description: z.string().max(155),
      updated: z.string().date(),
    })
    .strict(),
});
```

### 2. ArticleBody

| Block            | Renders as                                                                                                                                                             |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `h2`             | `<h2 id>` inside `Prose`, with a hover anchor link; `scroll-mt-24`                                                                                                     |
| `h3`             | `<h3 id>`                                                                                                                                                              |
| `p`              | `<p>`. Inlines: `<strong>`, `<em>`, `<a>` (external links: `rel="noopener"`, `target="_blank"`; internal `/…` links use the router `Link`)                             |
| `ul` / `ol`      | List with `Prose` spacing                                                                                                                                              |
| `image`          | `ResponsiveImage` (`sizes="(min-width: 768px) 720px, 100vw"`) inside `<figure>`; the alt text is used, and also shown as a caption when it's longer than 40 characters |
| `video`          | `VideoEmbed` facade; `video_play {location:"article"}`                                                                                                                 |
| `doctor-callout` | `Notice tone="info"` with the title "When to see a doctor" and an `Info` icon, rendering its child blocks                                                              |

- The renderer is a pure switch over the discriminated union. Unknown block types are a TypeScript error, and at runtime they are skipped.
- Text is always set as React text nodes (no `dangerouslySetInnerHTML`).
- `toc` from the catalog feeds the article's "On this page" list (change 14).

`RichText` renders `string[]` paragraphs (story `fullStory`) as `<p>`s, with no formatting.

### 3. FAQ content

Seed `content/faq.ts` with the items specified in changes 13 (seminars), 16 (business) and 18 (general), plus "Can I take more than one product?" → "Ask us on WhatsApp; we'll check the usage instructions with you." `{bank}`, `{deliveryNote}`, `{pickupAddress}`, `{openingHours}`, `{referralReward}`, `{referralFriendReward}` and `{loyaltyText}` tokens are resolved from catalog settings by `getFaqs()`. An item whose token is missing is omitted.

### 4. Repo content lint

`scripts/lint-content.ts` runs in `ci:build` before the build. It scans `content/faq.ts`, `content/business.ts` and `content/legal/*.mdx` with `scripts/lib/compliance.ts`. Allowlist: the health disclaimer text, "see a doctor", and the legal health-disclaimer page (which must name the concept of disease in order to disclaim it). Failures show file:line and the word.

### 5. Starter articles (drafted in Google Docs)

Created with "New article from template" (change 03), 500–800 words each, `ready = No`:

1. "5 habits for better digestion" (topic digestion, related category digestive-health)
2. "How to build a simple daily wellness routine" (everyday-wellness)
3. "Getting the most from your supplements: timing, storage and consistency" (everyday-wellness): general guidance and "follow the pack instructions"

Each has a cover from a licensed library (Drive), alt text and a "When to see a doctor" section where relevant. The client approves by setting Ready = Yes.

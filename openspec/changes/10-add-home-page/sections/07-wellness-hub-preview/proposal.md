## Why

Showing recent articles proves the business educates rather than just sells, and sends visitors into content that ranks on Google.

## What Changes

- The three latest articles as `ArticleCard`s with "Visit the Wellness Hub". Hidden if no articles are published.
- Introduces the shared `ArticleCard` (reused by change 14).

Spec: `../../specs/home/wellness-hub-preview/spec.md`

## Impact

- `src/components/marketing/article-card.tsx`, `src/features/home/components/wellness-hub-preview.tsx`
- Data: `getArticles().slice(0, 3)`.

## Why

The article page is where search visitors land. It must be fast, readable, trustworthy (date, author as the business, disclaimer), and lead to the next step.

## What Changes

- Article layout: breadcrumbs, topic, h1, description, meta (date · reading time), cover, the Google Doc body rendered by `ArticleBody` (change 08) in `Prose`, an "On this page" list from the article's headings, the CTA block (section 06), health disclaimer, related articles (same topic, max 3), and an optional "Related products" link to the category.
- `article_read` tracking at 75% scroll.

Spec: `../../specs/learn/article-page/spec.md`

## Impact

- `src/features/learn/article-view.tsx` and components.

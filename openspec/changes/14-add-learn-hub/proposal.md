## Why

The Wellness Hub builds authority and brings visitors from Google without paid ads (plan §3.3 page 5). Every piece ends with a call to action: attend the seminar, view related products, or chat with us.

## What Changes

- `/learn` (hub) and `/learn/$slug` (article) from the catalog: articles are written by the client in Google Docs and listed in the Sheet's `Articles` tab; videos come from the `Videos` tab (changes 03 and 04).

| #   | Folder                          | Section                                           | Route          |
| --- | ------------------------------- | ------------------------------------------------- | -------------- |
| 1   | `sections/01-hub-header`        | Title, intro, featured (newest) article           | `/learn`       |
| 2   | `sections/02-topic-filter`      | Topic chips (`?topic=`)                           | `/learn`       |
| 3   | `sections/03-article-grid`      | Article cards                                     | `/learn`       |
| 4   | `sections/04-video-library`     | Short videos (YouTube/TikTok facades)             | `/learn`       |
| 5   | `sections/05-article-page`      | Article layout: header, body, disclaimer, related | `/learn/$slug` |
| 6   | `sections/06-article-cta-block` | The standard end-of-article CTA trio              | `/learn/$slug` |

## Capabilities

### New Capabilities

- `learn/page`, `learn/hub-header`, `learn/topic-filter`, `learn/article-grid`, `learn/video-library`, `learn/article-page`, `learn/article-cta`.

## Impact

- Depends on 01, 02, 04 (`getArticles`, `getVideos`, topics), 07 (Article JSON-LD, sitemap), 08 (`ArticleBody`), `ArticleCard` (10/07).
- Client inputs: `Articles` rows with Ready = Yes (and their Google Docs), `Videos` rows.

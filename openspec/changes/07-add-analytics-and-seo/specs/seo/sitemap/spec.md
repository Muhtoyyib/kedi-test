## Purpose

Lists every indexable page for search engines, kept in step with the product catalogue and articles, and points crawlers to it.

## ADDED Requirements

### Requirement: Complete sitemap

The sitemap SHALL list every indexable static page, every active product and category page, and every published article, and SHALL exclude thank-you pages.

#### Scenario: New article published

- **WHEN** a new article is added and the site deploys
- **THEN** the sitemap contains its URL

### Requirement: Robots file

The robots file SHALL allow crawling of the site, disallow /thank-you/, and point to the sitemap.

#### Scenario: Fetch robots.txt

- **WHEN** a crawler fetches /robots.txt
- **THEN** it receives the sitemap location and the thank-you disallow rule

## Purpose

Gives every page a unique title, description, canonical address and a good preview when shared on WhatsApp, Facebook and X, and keeps private pages out of search results.

## ADDED Requirements

### Requirement: Unique titles and descriptions

Every indexable page SHALL have a unique title in the pattern "{Page} | {Brand}" and a description of at most 155 characters.

#### Scenario: Product page title

- **WHEN** a product page is rendered
- **THEN** its title uses the product's SEO title from the Sheet, or "{name} — {pack size} | {Brand}" when blank

### Requirement: Link previews

Every page SHALL provide Open Graph tags with a title, description and a 1200×630-class image, so links shared on WhatsApp show a preview.

#### Scenario: Sharing a product on WhatsApp

- **WHEN** a product link is pasted into WhatsApp
- **THEN** the preview shows the product name, description and product image

### Requirement: Canonical addresses

Every page SHALL declare a canonical URL without query parameters.

#### Scenario: Link with tracking parameters

- **WHEN** a page is opened with ?utm_source=instagram
- **THEN** its canonical URL has no query string

### Requirement: Private pages not indexed

Thank-you pages and the not-found page SHALL be marked noindex and excluded from the sitemap.

#### Scenario: Thank-you page

- **WHEN** a search engine fetches /thank-you/contact
- **THEN** the page carries a noindex directive

## Purpose

Turns the client's Sheet data and Drive photos into validated static data and optimised images at build time, and refuses to publish broken data.

## ADDED Requirements

### Requirement: Validated before publishing

The build SHALL validate all catalog data and SHALL fail without deploying when any row is invalid, naming the tab, row, product ID and field.

#### Scenario: Missing price format

- **WHEN** a product's price is "18,5OO" (letter O)
- **THEN** the build fails with "Products row N (KD-P…): price_ngn is not a number"
- **AND** the live site keeps its previous version

### Requirement: Optimised product images

Each product and category image SHALL be published in AVIF and WebP at widths up to 1200px, never larger than the original, and unchanged photos SHALL NOT be reprocessed on later builds.

#### Scenario: Unchanged photo

- **WHEN** the site is rebuilt and a product photo has not changed in Drive
- **THEN** the photo is not downloaded or re-encoded

### Requirement: Missing price shows "Ask for price"

A product with a blank price SHALL be published with no price, and the site SHALL show "Ask for price" for it.

#### Scenario: Blank price

- **WHEN** a product's price_ngn is blank
- **THEN** its card and page show "Ask for price"

### Requirement: Every product and category gets a page

The build SHALL produce one page per active product and one per active category.

#### Scenario: New product published

- **WHEN** the client adds an active product and publishes
- **THEN** `/products/{slug}` exists on the live site after the deploy

### Requirement: Client content images and videos are self-hosted

Photos for seminar highlights, customer stories and articles (including images inside article Docs), and poster images for YouTube and TikTok videos, SHALL be downloaded and served from the website itself in optimised formats.

#### Scenario: Article with an inline photo

- **WHEN** an article's Google Doc contains a photo
- **THEN** the published article shows an optimised copy served from the website, with the photo's alt text

#### Scenario: TikTok poster unavailable

- **WHEN** a TikTok video's poster image can't be fetched during the build
- **THEN** a branded placeholder poster is used and the build continues

### Requirement: Compliance re-checked at build

The build SHALL fail if client-written article, story or highlight text contains banned health-claim words outside the "When to see a doctor" section, naming the item and the word.

#### Scenario: Claim slipped past the Sheet check

- **WHEN** an article containing "cures" reaches the build
- **THEN** the build fails naming the article and the word, and the live site is unchanged

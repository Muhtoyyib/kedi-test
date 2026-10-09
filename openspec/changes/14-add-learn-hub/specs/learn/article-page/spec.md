## Purpose

Presents a Wellness Hub article in a fast, readable layout, with clear authorship and date, the health disclaimer, and links to related reading and products.

## ADDED Requirements

### Requirement: Readable article

Each article page SHALL show the topic, title, description, author as the business team, publish date, reading time and cover image, followed by the article body.

#### Scenario: Article header

- **WHEN** a reader opens an article
- **THEN** the header shows "By the {Brand} team · {date} · {n} min read"

### Requirement: Disclaimer and onward links

Each article SHALL end with the call-to-action block, the full health disclaimer, a link to the related product category when one is set, and up to three related articles.

#### Scenario: Article with a related category

- **WHEN** an article sets a related category
- **THEN** the end of the article shows "Explore our {Category} range" linking to that category

#### Scenario: Article without a related category

- **WHEN** an article has no related category
- **THEN** no product link is shown

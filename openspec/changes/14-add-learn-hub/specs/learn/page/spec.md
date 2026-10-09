## Purpose

Defines the Wellness Hub listing at /learn and article pages at /learn/{slug}, including their search metadata.

## ADDED Requirements

### Requirement: Hub and article pages

/learn SHALL list published articles (Ready = Yes in the Sheet) newest first, and each published article SHALL have its own page; unpublished and unknown slugs SHALL show the not-found page.

#### Scenario: Unpublished article URL

- **WHEN** a visitor opens the URL of an article whose row is set to Ready = No
- **THEN** the not-found page is shown

### Requirement: Article search metadata

Each article page SHALL use its title and description in its metadata and provide Article structured data with its publish date and cover image.

#### Scenario: Shared article

- **WHEN** an article link is shared on WhatsApp
- **THEN** the preview shows the article title, description and cover image

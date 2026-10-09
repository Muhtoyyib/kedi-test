## Purpose

Defines the home page as the main landing page: what it contains, in what order, and how it describes itself to search engines and link previews.

## ADDED Requirements

### Requirement: Section order

The home page SHALL present, in order: hero, trust bar, why buy from us, featured products, next seminar, customer stories (if any), Wellness Hub articles (if any), and the final call to action.

#### Scenario: Full content

- **WHEN** the catalog has featured products, a scheduled seminar, published stories and articles
- **THEN** all eight sections appear in that order

#### Scenario: No stories or articles yet

- **WHEN** no stories or articles are published
- **THEN** those two sections are omitted and the other sections still render

### Requirement: Home metadata

The home page title SHALL be "{Brand} — Your trusted KEDI wellness partner in {City}" and its description SHALL mention genuine KEDI products, free seminars and WhatsApp ordering.

#### Scenario: Shared on WhatsApp

- **WHEN** the home URL is shared on WhatsApp
- **THEN** the preview shows the brand title and description

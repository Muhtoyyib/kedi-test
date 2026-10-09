## Purpose

Highlights the three newest Wellness Hub articles on the home page and leads visitors to the hub.

## ADDED Requirements

### Requirement: Latest articles

The section SHALL show the three most recent published articles with cover, topic, title, short description and reading time, each linking to its article.

#### Scenario: Open an article

- **WHEN** a visitor taps an article card
- **THEN** that article's page opens

### Requirement: Hidden without articles

The section SHALL NOT render when no articles are published.

#### Scenario: No articles yet

- **WHEN** no article in the Sheet is marked Ready = Yes
- **THEN** the home page has no Wellness Hub section

## Purpose

Lists Wellness Hub articles as cards, newest first, in manageable batches.

## ADDED Requirements

### Requirement: Article list

The hub SHALL list articles newest first as cards with cover, topic, title, description and reading time, showing 12 at a time with a "Show more articles" action.

#### Scenario: 20 articles

- **WHEN** 20 articles are published
- **THEN** 12 are shown, and tapping "Show more articles" shows the remaining 8

### Requirement: No articles yet

When no articles are published, the hub SHALL say articles are coming soon and link to the seminars.

#### Scenario: Empty hub

- **WHEN** no articles are published
- **THEN** the message "Articles are coming soon" with a seminar link is shown

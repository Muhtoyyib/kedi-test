## Purpose

Defines how pages choose and order catalog data (featured, related and in-stock ordering, and the next seminar), so every page shows the same, current information.

## ADDED Requirements

### Requirement: Consistent product ordering

Product lists SHALL be ordered by the Sheet's sort order then name, with out-of-stock products after in-stock ones.

#### Scenario: Out of stock product in a grid

- **WHEN** a category has 5 products and one is out of stock
- **THEN** the out-of-stock product appears last in that category grid

### Requirement: Featured products always fill the home grid

The home page SHALL show the featured products and, if fewer than 4 are featured, SHALL fill up to 4 with in-stock products.

#### Scenario: Only two featured

- **WHEN** two products are marked featured
- **THEN** the home grid shows those two first and two more in-stock products

### Requirement: Next seminar is always in the future

Wherever the "next seminar" is shown, it SHALL be the earliest scheduled seminar that has not yet started at the moment the visitor views the page, in West Africa Time.

#### Scenario: Stale page after the seminar started

- **WHEN** a visitor opens the home page at 4:30 PM on the day of a 4:00 PM seminar, before the nightly rebuild
- **THEN** the banner shows the following scheduled seminar, or the no-upcoming-seminar message if there is none

#### Scenario: Cancelled seminar

- **WHEN** the next seminar row is marked cancelled
- **THEN** it is skipped and the following scheduled seminar is shown

### Requirement: Client content ordering

Stories SHALL be ordered featured first then newest, and highlights, videos and articles newest first; articles and videos SHALL be filterable by topic.

#### Scenario: Featured story

- **WHEN** one story is featured and three are newer
- **THEN** the featured story is listed first

#### Scenario: Topic counts

- **WHEN** three articles are about digestion and one about energy
- **THEN** the topic list reports digestion 3 and energy 1, and omits topics with no articles

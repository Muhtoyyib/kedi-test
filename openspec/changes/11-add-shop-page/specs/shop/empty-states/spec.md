## Purpose

Makes sure a search with no matches, or an empty category, always offers a next step instead of a dead end.

## ADDED Requirements

### Requirement: No-results help

When a search matches nothing, the shop SHALL say so, offer to clear the search, and offer a WhatsApp enquiry that includes the search term.

#### Scenario: Unknown product name

- **WHEN** a visitor searches "ginseng drink" and nothing matches
- **THEN** the page shows "No products match "ginseng drink"", a "Clear search" button and an "Ask us on WhatsApp" button whose message mentions "ginseng drink"

### Requirement: Empty category help

When a category has no active products, its page SHALL say so and link to all products and WhatsApp.

#### Scenario: Category emptied

- **WHEN** every product in a category is inactive but the category is active
- **THEN** the category page shows "Nothing in {category} right now" with "See all products" and "Ask on WhatsApp"

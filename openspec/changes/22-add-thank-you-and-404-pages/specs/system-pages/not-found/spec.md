## Purpose

Keeps visitors who follow a broken or outdated link on the site, with search, key links and WhatsApp.

## ADDED Requirements

### Requirement: Helpful not-found page

Unknown addresses SHALL return status 404 and show "We can't find that page" with a shop search, links to the shop, seminars and home, and a WhatsApp action.

#### Scenario: Removed product link

- **WHEN** a visitor opens the link of a product that no longer exists
- **THEN** the not-found page is shown with status 404 and a shop search box

#### Scenario: Search from 404

- **WHEN** the visitor searches "tea" from the not-found page
- **THEN** the shop opens filtered by "tea"

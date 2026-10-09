## Purpose

Lets visitors find a product by name instantly and order the listing by price or name, with shareable links.

## ADDED Requirements

### Requirement: Instant search within the listing

Typing in the search field SHALL filter the current listing to products whose name, benefit line, category or pack size contain every typed word, ignoring case and accents, and SHALL announce the number of results.

#### Scenario: Search by partial name

- **WHEN** a visitor types "prod a" on /shop
- **THEN** only products matching both words are shown and "Showing 1 of 24 products" is announced

#### Scenario: Clear search

- **WHEN** the visitor taps the clear button
- **THEN** all products in the listing are shown again

### Requirement: Sorting

The listing SHALL be sortable by Recommended, Price low to high, Price high to low and Name, with "Ask for price" products last when sorting by price.

#### Scenario: Price low to high

- **WHEN** a visitor chooses "Price: low to high"
- **THEN** priced products appear from cheapest to most expensive, followed by Ask-for-price products

### Requirement: Shareable state

The search term and sort order SHALL be reflected in the page address, so a copied link reopens the same results.

#### Scenario: Share a search

- **WHEN** a visitor opens a link to /shop?q=tea&sort=price-asc
- **THEN** the listing shows the matching products sorted by price

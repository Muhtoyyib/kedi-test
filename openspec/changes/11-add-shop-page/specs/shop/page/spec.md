## Purpose

Defines the shop listing at /shop and the per-category listings at /shop/{category}: what they contain and how they are described to search engines.

## ADDED Requirements

### Requirement: All products and category listings

/shop SHALL list every active product, and /shop/{category} SHALL list only that category's active products, both readable without JavaScript.

#### Scenario: Category page

- **WHEN** a visitor opens /shop/digestive-health
- **THEN** only Digestive Health products are listed

#### Scenario: Unknown category

- **WHEN** a visitor opens /shop/not-a-category
- **THEN** the not-found page is shown with status 404

### Requirement: Shop metadata

/shop SHALL have the title "Shop KEDI products | {Brand}", and category pages SHALL use "{Category} — KEDI products | {Brand}" with the category description.

#### Scenario: Category title

- **WHEN** the Digestive Health page is rendered
- **THEN** its title is "Digestive Health — KEDI products | {Brand}"

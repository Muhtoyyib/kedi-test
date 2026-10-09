## Purpose

Shows visitors where the product sits in the shop and lets them go back to its category or the shop in one tap.

## ADDED Requirements

### Requirement: Breadcrumb trail

The product page SHALL show Home › Shop › {Category} › {Product} on larger screens and a link back to the category on phones.

#### Scenario: Phone

- **WHEN** a visitor views a product at 360px wide
- **THEN** a "‹ {Category}" link is shown that opens the category page

#### Scenario: Desktop

- **WHEN** a visitor views a product at 1280px wide
- **THEN** the full trail is shown with the product marked as the current page

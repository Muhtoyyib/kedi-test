## Purpose

Lets visitors add popular products to their order straight from the home page and jump to any category.

## ADDED Requirements

### Requirement: Featured grid

The section SHALL show the featured products (4 on phones, up to 8 on larger screens) as product cards with price and add-to-cart, and a link to all products.

#### Scenario: Phone

- **WHEN** viewed at 360px wide with 8 featured products
- **THEN** 4 product cards are shown in two columns, followed by "View all products"

#### Scenario: Add from home

- **WHEN** a visitor taps "Add to cart" on a featured card
- **THEN** the product is added and the cart count updates

### Requirement: Category shortcuts

The section SHALL show links to up to six categories and to all products.

#### Scenario: Choose a category

- **WHEN** a visitor taps the "Digestive Health" chip
- **THEN** the Digestive Health category page opens

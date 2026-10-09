## Purpose

Lets visitors narrow the product list by category in one tap, using real category pages that work without JavaScript.

## ADDED Requirements

### Requirement: Category links with counts

The shop SHALL show "All products" and every active category with its number of products, linking to the corresponding listing, with the current one marked.

#### Scenario: Choose a category

- **WHEN** a visitor taps "Immunity (4)"
- **THEN** /shop/immunity opens and "Immunity" is marked as current

#### Scenario: Keep search when switching

- **WHEN** a visitor has searched "tea" and taps another category
- **THEN** the search term is kept on the new category page

### Requirement: Usable on small screens

On phones the category row SHALL scroll sideways and stay visible below the header while the visitor scrolls the products.

#### Scenario: Scrolling products on a phone

- **WHEN** a visitor scrolls down the product grid on a 360px screen
- **THEN** the category row stays visible at the top

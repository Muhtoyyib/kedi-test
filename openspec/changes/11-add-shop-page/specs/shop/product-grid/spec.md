## Purpose

Shows products as scannable cards (image, name, benefit, pack size, duration, price, stock) in a responsive grid, each with one-tap add to cart.

## ADDED Requirements

### Requirement: Product card content

Each product card SHALL show the main image, category, name, approved benefit line, pack size, how long a pack lasts, the price or "Ask for price", and an add-to-cart action, and SHALL link to the product page.

#### Scenario: Priced, in-stock product

- **WHEN** a product priced ₦18,500 with 60 capsules lasting 28 days is shown
- **THEN** its card shows "₦18,500", "60 capsules · Lasts about 4 weeks" and "Add to cart"

#### Scenario: Open product

- **WHEN** a visitor taps the product image or name
- **THEN** the product page opens

#### Scenario: Add without opening

- **WHEN** a visitor taps "Add to cart" on the card
- **THEN** the product is added and the visitor stays on the listing

### Requirement: Out-of-stock cards

Out-of-stock products SHALL show an "Out of stock" badge and an "Ask on WhatsApp" action instead of add to cart.

#### Scenario: Out of stock card

- **WHEN** a product is out of stock
- **THEN** its card shows "Out of stock" and "Ask on WhatsApp"

### Requirement: Responsive grid

The grid SHALL show two columns on phones, three on tablets and four on desktops, with aligned add-to-cart buttons.

#### Scenario: Phone

- **WHEN** the shop is viewed at 360px wide
- **THEN** products are in two columns and every card's button is at the bottom of its card

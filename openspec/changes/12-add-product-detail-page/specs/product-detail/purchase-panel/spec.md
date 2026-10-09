## Purpose

Puts the buying decision in one place: product name, approved benefit line, pack size, how long it lasts, price, availability, add to cart, and asking on WhatsApp.

## ADDED Requirements

### Requirement: Decision information

The panel SHALL show the product name as the page heading, the approved benefit line, pack size, how long a pack lasts, the price (or "Ask for price") and whether it is in stock.

#### Scenario: In-stock product

- **WHEN** a visitor opens an in-stock product priced ₦18,500
- **THEN** the panel shows the name, "₦18,500", "In stock", the pack size and "Lasts about …"

### Requirement: Two ways to proceed

The panel SHALL offer adding a chosen quantity to the cart and asking about the product on WhatsApp with a message naming the product.

#### Scenario: Ask first

- **WHEN** a visitor taps "Ask about this product on WhatsApp"
- **THEN** WhatsApp opens with a message asking about that product and its pack size

#### Scenario: Out of stock

- **WHEN** the product is out of stock
- **THEN** no add-to-cart control is shown, and the WhatsApp button reads "Ask when it's back in stock"

### Requirement: Reassurance

The panel SHALL state that the product is genuine, that delivery fees are confirmed on WhatsApp (with a link to delivery information), and that the business checks in after delivery.

#### Scenario: Trust lines

- **WHEN** a visitor views any product
- **THEN** the three reassurance lines are shown beneath the actions

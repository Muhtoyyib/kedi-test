## Purpose

Lets visitors add products to their order with one tap from anywhere a product appears, with clear confirmation and sensible handling of out-of-stock and unpriced products.

## ADDED Requirements

### Requirement: One-tap add with confirmation

Tapping Add to cart SHALL add the product (or the chosen quantity on the product page), update the cart count, and confirm with an "Added to cart" message that offers to view the cart.

#### Scenario: Add from a product card

- **WHEN** a visitor taps "Add to cart" on a product card
- **THEN** the product is in the cart with quantity 1
- **AND** the header cart count increases by 1
- **AND** a message "Added to cart" with a "View cart" action appears

#### Scenario: Add a quantity from the product page

- **WHEN** a visitor sets the quantity to 3 on a product page and taps "Add to cart"
- **THEN** the cart holds that product with quantity 3

### Requirement: Out-of-stock products are enquired about, not added

For an out-of-stock product, the add control SHALL be replaced by an "Ask on WhatsApp" action with the out-of-stock enquiry message.

#### Scenario: Out of stock

- **WHEN** a visitor views an out-of-stock product card
- **THEN** there is no Add to cart button
- **AND** "Ask on WhatsApp" opens a chat asking when the product will be available

### Requirement: Unpriced products can still be ordered

Products without a published price SHALL be addable, with a note that the price will be confirmed on WhatsApp.

#### Scenario: Ask-for-price product

- **WHEN** a visitor adds a product showing "Ask for price"
- **THEN** it is added and the visitor sees "We'll confirm the price on WhatsApp"

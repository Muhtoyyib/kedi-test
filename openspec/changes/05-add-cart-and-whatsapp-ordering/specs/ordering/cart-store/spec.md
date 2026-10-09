## Purpose

Keeps the visitor's cart safe across page loads, app switches and tabs, always priced from the current catalog and within sensible limits.

## ADDED Requirements

### Requirement: Cart persists on the device

The cart SHALL be kept on the visitor's device and restored on every page and on return visits, until the visitor clears it or confirms the order was sent.

#### Scenario: Switch to WhatsApp and back

- **WHEN** a visitor with 2 items switches to another app and returns to the site later
- **THEN** the cart still holds the same 2 items

#### Scenario: Two tabs

- **WHEN** a visitor adds an item in one tab
- **THEN** the cart count in another open tab updates without reloading

### Requirement: Current prices only

The cart SHALL show the current published price for every item, and SHALL drop items that are no longer sold, telling the visitor once.

#### Scenario: Product removed from the catalog

- **WHEN** a product in the cart is no longer active after a publish
- **THEN** it is removed from the cart and the drawer shows "1 item is no longer available and was removed"

### Requirement: Cart limits

The cart SHALL hold at most 20 different products and at most 20 of each product.

#### Scenario: Twenty-first product

- **WHEN** a visitor tries to add a 21st different product
- **THEN** it is not added and the visitor sees "Your cart is full. Send this order first, or message us for large orders."

### Requirement: Corrupt storage is harmless

If stored cart data is unreadable, the site SHALL start with an empty cart without errors.

#### Scenario: Damaged storage

- **WHEN** the stored cart value is not valid data
- **THEN** the page loads normally with an empty cart

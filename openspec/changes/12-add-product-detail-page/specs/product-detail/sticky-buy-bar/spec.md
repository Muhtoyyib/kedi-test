## Purpose

Keeps the price, add to cart and WhatsApp within reach on phones after the main purchase buttons scroll out of view.

## ADDED Requirements

### Requirement: Appears after the main button scrolls away

On screens narrower than 768px, a bottom bar with the product name, price, Add to cart and a WhatsApp button SHALL appear once the main Add to cart button has scrolled out of view, and SHALL hide when it is visible again.

#### Scenario: Reading the description

- **WHEN** a visitor on a phone scrolls down to "How to use"
- **THEN** the bottom bar shows the price and Add to cart

#### Scenario: Back at the top

- **WHEN** the visitor scrolls back up to the main Add to cart button
- **THEN** the bottom bar hides

### Requirement: Out-of-stock bar

For out-of-stock products the bar SHALL offer "Ask when back in stock" instead of Add to cart.

#### Scenario: Out of stock on mobile

- **WHEN** the product is out of stock and the bar is visible
- **THEN** it shows "Ask when back in stock", opening WhatsApp

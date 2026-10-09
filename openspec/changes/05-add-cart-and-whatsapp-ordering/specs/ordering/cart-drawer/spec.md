## Purpose

Lets customers review and adjust their order, understand what they will pay and how, and get reassurance about safe payment before sending it.

## ADDED Requirements

### Requirement: Editable order summary

The cart SHALL list each product with its image, name, pack size, unit price, quantity controls, remove action and line total, followed by the subtotal.

#### Scenario: Change quantity in the cart

- **WHEN** a visitor increases a line from 1 to 2
- **THEN** the line total and subtotal update immediately

### Requirement: Delivery fee is confirmed, not calculated

The cart SHALL state that the delivery fee is confirmed on WhatsApp, and SHALL show the delivery note from the Sheet when set.

#### Scenario: Delivery line

- **WHEN** a visitor opens a cart with items
- **THEN** the summary shows "Delivery: Confirmed on WhatsApp"

### Requirement: Free delivery hint

When the Sheet sets a free-delivery threshold and the subtotal is below it, the cart SHALL show how much more is needed.

#### Scenario: Below threshold

- **WHEN** the threshold is ₦50,000 and the subtotal is ₦42,000
- **THEN** the cart shows "Add ₦8,000 more for free delivery"

### Requirement: Payment safety reminder

The cart SHALL remind customers that payment details only come from the official WhatsApp number.

#### Scenario: Cart with items

- **WHEN** the cart is open with at least one item
- **THEN** the payment safety note is visible above the order details

### Requirement: Helpful empty cart

An empty cart SHALL offer links to the shop and to WhatsApp.

#### Scenario: Empty

- **WHEN** a visitor opens the cart with no items
- **THEN** "Your cart is empty" is shown with "Shop products" and "Ask on WhatsApp" actions

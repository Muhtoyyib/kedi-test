## Purpose

Resolves the cart after the customer comes back from WhatsApp, so a sent order is cleared, an unsent one can be sent again, and nothing is lost.

## ADDED Requirements

### Requirement: Ask after returning

When a customer returns to the site within 24 hours of sending an order, the site SHALL ask whether the order was sent on WhatsApp.

#### Scenario: Back button from WhatsApp

- **WHEN** a customer sends an order, then returns to the site with the back button
- **THEN** a banner asks "Did your order KD-… send on WhatsApp?"

### Requirement: Confirmed orders clear the cart

Confirming the order was sent SHALL empty the cart and thank the customer, explaining that the business will confirm stock, delivery fee and payment.

#### Scenario: Yes, it's sent

- **WHEN** the customer taps "Yes, it's sent"
- **THEN** the cart is empty and a thank-you message is shown

### Requirement: Resend without duplicating

"Open WhatsApp again" SHALL reopen the same message with the same order ID and SHALL NOT record a second order.

#### Scenario: Customer backed out of WhatsApp

- **WHEN** the customer taps "Open WhatsApp again"
- **THEN** WhatsApp opens with the same order message
- **AND** the Sheet still has one row for that order ID

### Requirement: Old pending orders expire

After 24 hours the banner SHALL no longer appear, and the cart SHALL be kept.

#### Scenario: Next day

- **WHEN** the customer returns 30 hours after sending
- **THEN** no banner is shown and the cart still contains the items

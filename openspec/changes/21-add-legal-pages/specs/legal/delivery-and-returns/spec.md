## Purpose

Publishes current delivery areas, fees and times from the Sheet, how pickup and payment work, and the returns policy.

## ADDED Requirements

### Requirement: Live delivery table

The page SHALL list every active delivery area with its fee and delivery time from the Sheet, grouped into local, interstate and pickup.

#### Scenario: Fee changed

- **WHEN** the client changes the Ikeja fee in the Sheet and publishes
- **THEN** the delivery page shows the new fee

#### Scenario: No delivery areas

- **WHEN** the Delivery tab has no active rows
- **THEN** the page says "Ask us on WhatsApp for delivery fees" instead of an empty table

### Requirement: Problems and returns

The page SHALL explain how to report a damaged, missing or wrong item within 48 hours, and the conditions for returns and refunds.

#### Scenario: Damaged item

- **WHEN** a customer reads what to do about a damaged item
- **THEN** the page tells them to message within 48 hours with a photo for a replacement or refund

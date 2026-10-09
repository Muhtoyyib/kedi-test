## Purpose

Sends the customer's order to the business on WhatsApp in one tap, as a clear pre-written message, while recording the same order in the Sheet without delaying the customer.

## ADDED Requirements

### Requirement: WhatsApp opens immediately with the order

Tapping "Send order on WhatsApp" with valid details SHALL open WhatsApp to the business number with a message containing the order ID, each item with quantity and line price, the subtotal (noting that delivery is confirmed separately), the customer's name, delivery area and referral code if any.

#### Scenario: Two priced items

- **WHEN** a customer with Product A × 2 (₦18,500 each) and Product B × 1 (₦12,000) taps send
- **THEN** WhatsApp opens with a message listing "Product A × 2 — ₦37,000", "Product B × 1 — ₦12,000" and "Subtotal: ₦49,000 (delivery fee to be confirmed)"

#### Scenario: Mobile browser

- **WHEN** the customer taps send on a phone
- **THEN** WhatsApp opens without a pop-up being blocked

### Requirement: Order recorded without waiting

The same order SHALL be sent to the Sheet in the background with the same order ID, and opening WhatsApp SHALL NOT wait for the Sheet to respond.

#### Scenario: Slow network

- **WHEN** the network is slow
- **THEN** WhatsApp opens immediately and the order still reaches the Sheet afterwards

#### Scenario: Logging unavailable

- **WHEN** the order endpoint is not configured or cannot be reached
- **THEN** WhatsApp still opens with the full order message

### Requirement: Unique, readable order IDs

Every order SHALL get an ID in the form KD-YYMMDD-XXXX, using the date in West Africa Time and characters that cannot be confused (no 0, O, 1, I, L or U).

#### Scenario: Late-night order

- **WHEN** an order is sent at 00:30 WAT on 13 October 2026
- **THEN** its ID starts with KD-261013-

### Requirement: No double sends

The send button SHALL ignore repeat taps while an order is being sent.

#### Scenario: Double tap

- **WHEN** the customer taps send twice quickly
- **THEN** only one order is recorded and WhatsApp opens once

## Purpose

Records every website order in the client's Sheet the moment the customer taps "Send order on WhatsApp", exactly once, with prices checked against the product list.

## ADDED Requirements

### Requirement: Orders recorded once

Each order SHALL be recorded once, keyed by its order ID, with status "Started on website".

#### Scenario: Double tap

- **WHEN** the same order ID is received twice
- **THEN** the Orders tab contains one row for it

### Requirement: Prices checked server-side

The order record SHALL include a subtotal recomputed from the Products tab, and SHALL flag a mismatch with the subtotal the browser sent.

#### Scenario: Edited price

- **WHEN** an order arrives whose subtotal does not match the product prices
- **THEN** the order is recorded with price_mismatch = Yes and the computed subtotal

### Requirement: Customer record kept up to date

Recording an order SHALL create the customer in Leads & Customers if the phone number is new, and SHALL NOT downgrade an existing customer's status.

#### Scenario: Returning customer orders again

- **WHEN** a Repeat Customer places a new website order
- **THEN** their status stays Repeat Customer

### Requirement: Abuse limits

The order endpoint SHALL ignore submissions with a filled honeypot field, reject payloads over 10 KB or with more than 20 lines, and limit each phone number to 5 submissions per 10 minutes.

#### Scenario: Bot submission

- **WHEN** a submission has a non-empty honeypot field
- **THEN** it is not recorded and the response still reports success

#### Scenario: Flooding

- **WHEN** the same phone number submits a sixth order within 10 minutes
- **THEN** the response is `{ok:false, code:"rate_limited"}` and nothing is recorded

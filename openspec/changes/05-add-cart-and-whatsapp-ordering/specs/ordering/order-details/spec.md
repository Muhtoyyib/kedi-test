## Purpose

Collects the minimum details the distributor needs to confirm an order (name, WhatsApp number and delivery area), plus an optional referral code and an optional follow-up consent.

## ADDED Requirements

### Requirement: Required order details

Sending an order SHALL require a name, a valid Nigerian mobile number and a delivery area (or a typed area when "Other" is chosen).

#### Scenario: Missing area

- **WHEN** a visitor taps send without choosing a delivery area
- **THEN** the order is not sent, the area field shows "Choose where we should deliver", and focus moves to it

### Requirement: Delivery areas from the Sheet

The delivery area list SHALL show every active area from the Sheet with its fee and timeline, plus pickup and an "Other" option.

#### Scenario: Area with fee

- **WHEN** a visitor opens the delivery area list
- **THEN** each area shows its fee, such as "Ikeja — ₦2,500"

### Requirement: Referral code applied automatically

A referral code saved from a referral link SHALL be pre-filled and marked as applied, and the visitor SHALL be able to edit or clear it.

#### Scenario: Arrived from a referral link

- **WHEN** a visitor who opened a link with ?ref=AMAKA-4821 opens the cart
- **THEN** the referral code field shows AMAKA-4821 marked "Applied"

### Requirement: Follow-up consent is optional and unticked

The follow-up consent SHALL start unticked on every order, and SHALL NOT be required to send the order.

#### Scenario: Returning customer

- **WHEN** a returning customer's details are pre-filled from their last order
- **THEN** the follow-up consent box is still unticked

### Requirement: Details remembered for next time

After an order is sent, the name, phone and area SHALL be pre-filled on the next order on the same device, with a way to clear them.

#### Scenario: Second order

- **WHEN** a customer opens the cart a week after their first order
- **THEN** their name, phone and area are already filled in, with a "Not you? Clear details" link

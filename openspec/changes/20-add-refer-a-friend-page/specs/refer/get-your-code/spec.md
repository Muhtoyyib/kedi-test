## Purpose

Gives a customer their personal referral code and link instantly from their first name and WhatsApp number, and records it for reward tracking.

## ADDED Requirements

### Requirement: Instant code

Submitting a valid first name, WhatsApp number and consent SHALL immediately show the personal code and link, without waiting for the server.

#### Scenario: Amaka gets her link

- **WHEN** Amaka enters her name and 0803 123 4821 with consent and taps "Get my link"
- **THEN** "AMAKA-4821" and "https://[domain]/?ref=AMAKA-4821" are shown immediately

### Requirement: Code recorded for rewards

The code SHALL be recorded in the Sheet with the referrer's name and phone, and if recording fails the code SHALL still work and the visitor SHALL be told.

#### Scenario: Server unavailable

- **WHEN** recording the code fails twice
- **THEN** the code and link are still shown with a note that the code still works

### Requirement: Privacy of the number

The page SHALL explain that the code contains only the last 4 digits of the number, and SHALL NOT store the full phone number on the device.

#### Scenario: Device storage

- **WHEN** a code has been generated
- **THEN** only the first name and code are stored on the device

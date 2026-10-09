## Purpose

Lists the practical and regulatory facts about the product (NAFDAC number, pack size, duration, category, product code) in one scannable place.

## ADDED Requirements

### Requirement: Product facts list

The section SHALL list the NAFDAC registration number when available, the pack size, how long a pack lasts, the category and the product code.

#### Scenario: With NAFDAC number

- **WHEN** a product has NAFDAC number A7-1234
- **THEN** the facts list shows "NAFDAC reg. no. A7-1234" and a note on how to verify it

#### Scenario: Without NAFDAC number

- **WHEN** a product has no NAFDAC number
- **THEN** the NAFDAC row and verification note are omitted

### Requirement: Copyable product code

The product code SHALL be copyable with one tap for quoting on WhatsApp.

#### Scenario: Copy code

- **WHEN** a visitor taps "Copy" next to the product code
- **THEN** the code is copied and "Product code copied" is announced

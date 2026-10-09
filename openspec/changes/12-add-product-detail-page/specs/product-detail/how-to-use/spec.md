## Purpose

Shows the manufacturer's approved usage steps clearly, with a safety note and an easy way to ask questions about use.

## ADDED Requirements

### Requirement: Approved usage steps

The section SHALL list the approved usage instructions as numbered steps in the Sheet's order, followed by the instruction to follow the pack and consult a doctor in the listed situations.

#### Scenario: Product with three usage lines

- **WHEN** a product's how_to_use has three lines
- **THEN** three numbered steps are shown with that text, followed by the safety note

### Requirement: Help with use

The section SHALL offer a WhatsApp question about the product and a link to the seminars.

#### Scenario: Ask about use

- **WHEN** a visitor taps "Questions about using it? Ask us on WhatsApp"
- **THEN** WhatsApp opens with a message naming the product

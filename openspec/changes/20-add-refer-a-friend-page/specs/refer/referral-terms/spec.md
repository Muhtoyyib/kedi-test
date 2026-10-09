## Purpose

States the referral programme's terms in plain language, and the loyalty reward when one exists.

## ADDED Requirements

### Requirement: Plain terms

The page SHALL state that rewards apply only to a new customer's first paid order, that self-referral is not allowed, that rewards are not exchangeable for cash, and that the programme can change with earned rewards honoured.

#### Scenario: Terms shown

- **WHEN** a visitor reads "The small print"
- **THEN** each of these terms is listed

### Requirement: Loyalty note

When a loyalty reward is set in the Sheet, the page SHALL show it.

#### Scenario: Loyalty set

- **WHEN** loyalty_text is "Every 5th order earns a free gift."
- **THEN** a "Loyalty reward" note shows that text

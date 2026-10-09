## Purpose

Provides the legitimacy and legal information careful buyers look for (address, hours, contact, legal pages, independent-distributor statement and health disclaimer) at the bottom of every page.

## ADDED Requirements

### Requirement: Independent distributor statement

The footer SHALL state that the business is an independent distributor of KEDI Healthcare products and not the official KEDI company.

#### Scenario: Any page footer

- **WHEN** a visitor reaches the footer of any page
- **THEN** the independent distributor statement is visible

### Requirement: Short health disclaimer

The footer SHALL show the short health disclaimer with a link to the full disclaimer page.

#### Scenario: Disclaimer link

- **WHEN** a visitor taps "Full disclaimer" in the footer
- **THEN** the health disclaimer page opens

### Requirement: Contact details and hours

The footer SHALL show the business address, opening hours, phone number and email, with the phone and email as tappable links.

#### Scenario: Call from footer

- **WHEN** a visitor taps the phone number in the footer
- **THEN** the phone dialler opens with the business number

#### Scenario: Hours missing in the Sheet

- **WHEN** the opening hours setting is blank
- **THEN** the hours line is omitted and the rest of the contact block still renders

### Requirement: Category links stay in sync

The footer's shop links SHALL list exactly the active categories from the Sheet.

#### Scenario: New category published

- **WHEN** the client adds an active category and publishes
- **THEN** the footer lists the new category on every page

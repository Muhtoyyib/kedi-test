## Purpose

Records which campaign brought a visitor so the Sheet can show which ads and posts produce real orders and leads.

## ADDED Requirements

### Requirement: Campaign source attached to orders and leads

When a visitor lands with utm_source, utm_medium or utm_campaign parameters, those values SHALL be attached to any order or form they submit in the same browsing session.

#### Scenario: Instagram ad to order

- **WHEN** a visitor lands from a link with utm_source=instagram&utm_campaign=seminar-oct and sends an order
- **THEN** the order row in the Sheet records instagram and seminar-oct

#### Scenario: No campaign

- **WHEN** a visitor arrives without campaign parameters
- **THEN** orders and forms are recorded with empty campaign fields

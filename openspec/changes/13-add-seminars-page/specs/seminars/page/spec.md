## Purpose

Defines the seminars page: what it contains, the order of sections, and the event data it provides to search engines.

## ADDED Requirements

### Requirement: Seminar page structure

The seminars page SHALL present, in order: the next seminar, registration, what you'll learn, the host, upcoming seminars and calendar subscription, past highlights (if any), and seminar FAQs.

#### Scenario: Full schedule

- **WHEN** at least two seminars are scheduled
- **THEN** the next one is featured at the top and the others are listed under upcoming seminars

### Requirement: Event search data

The page SHALL provide schema.org Event data for each upcoming seminar, marked free, with WAT times and the correct attendance mode.

#### Scenario: Two upcoming seminars

- **WHEN** two seminars are scheduled
- **THEN** the page includes two Event entries

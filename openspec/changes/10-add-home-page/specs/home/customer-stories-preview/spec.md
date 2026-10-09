## Purpose

Shows three real customer comments about the service on the home page, with consent, to reassure first-time buyers.

## ADDED Requirements

### Requirement: Three consented stories

The section SHALL show up to three published stories (featured first, then latest), each with the quote, the customer's first name and initial, and their area.

#### Scenario: Two featured stories

- **WHEN** two stories are featured and five are published
- **THEN** the two featured stories and the most recent other story are shown

### Requirement: Hidden without stories

The section SHALL NOT render when no stories are published.

#### Scenario: Launch without testimonials

- **WHEN** no stories are published
- **THEN** the home page has no customer stories section

### Requirement: Photos only with consent

A story SHALL show the customer's photo only when photo consent is recorded; otherwise it shows their initials.

#### Scenario: Quote-only consent

- **WHEN** a story's consent covers only name and quote
- **THEN** an initials avatar is shown instead of a photo

## Purpose

Defines the FAQ page: grouped answers to common questions, kept up to date from the Sheet, with search metadata.

## ADDED Requirements

### Requirement: Grouped, current answers

/faq SHALL group questions under Ordering, Payment, Delivery, Returns, Products, Seminars, Referrals & rewards and Becoming a distributor, and answers mentioning bank details, delivery, hours or rewards SHALL use the current Sheet values.

#### Scenario: Bank details missing

- **WHEN** the Sheet has no bank details
- **THEN** the "How do I pay?" question is omitted rather than shown with missing details

### Requirement: FAQ structured data

The page SHALL provide FAQPage structured data containing every question shown.

#### Scenario: Validator

- **WHEN** the page is tested with a structured-data validator
- **THEN** a valid FAQPage with all displayed questions is found

## Purpose

Provides typed, validated sources for the developer-edited content (FAQs, About and host text, business-opportunity copy and legal pages), so invalid or non-compliant text fails the build.

## ADDED Requirements

### Requirement: Validated legal pages

Each legal page SHALL declare a title, a description of at most 155 characters, and the date it was last updated, and the build SHALL fail when any is missing.

#### Scenario: Missing updated date

- **WHEN** a legal page has no updated date
- **THEN** the build fails naming the file and the missing field

### Requirement: FAQ answers use live settings

FAQ answers that mention bank details, delivery notes, pickup address, hours or rewards SHALL show the current values from the Sheet, and an answer whose value is missing SHALL be omitted.

#### Scenario: Bank details changed

- **WHEN** the client changes the bank account in the Sheet and publishes
- **THEN** the "How do I pay?" answer shows the new account

#### Scenario: Bank details missing

- **WHEN** the Sheet has no bank details
- **THEN** the "How do I pay?" question is not shown

### Requirement: No health claims in repo content

FAQs, business-opportunity copy and legal pages SHALL NOT contain banned health-claim words outside the approved disclaimer wording, and the build SHALL fail if they do.

#### Scenario: Claim in an FAQ answer

- **WHEN** an FAQ answer says a product "treats" a condition
- **THEN** the build fails pointing to the file and line

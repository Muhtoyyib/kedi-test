## Purpose

Gives all legal pages one readable layout with the last-updated date and a table of contents.

## ADDED Requirements

### Requirement: Readable legal pages

Each legal page SHALL show its title, the date it was last updated, a table of contents of its main headings, and its content in a readable column.

#### Scenario: Privacy policy

- **WHEN** a visitor opens /privacy
- **THEN** the title, "Last updated {date}" and a list of section links are shown above the policy text

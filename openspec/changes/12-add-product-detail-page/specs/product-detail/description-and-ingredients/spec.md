## Purpose

Presents the product's approved description and key ingredients exactly as provided by the client.

## ADDED Requirements

### Requirement: Approved description

The section SHALL show the approved description paragraphs verbatim, and on phones SHALL collapse descriptions longer than three paragraphs behind "Read more" while keeping the full text in the page.

#### Scenario: Long description on a phone

- **WHEN** a description has five paragraphs and is viewed at 360px wide
- **THEN** two paragraphs are visible with a "Read more" button that reveals the rest

### Requirement: Ingredients when available

A "Key ingredients" list SHALL be shown when ingredients are provided, and omitted otherwise.

#### Scenario: No ingredients in the Sheet

- **WHEN** the ingredients field is blank
- **THEN** no ingredients heading is shown

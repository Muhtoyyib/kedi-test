## Purpose

Presents answers in expandable groups, with links that open a specific answer so the business can share them on WhatsApp.

## ADDED Requirements

### Requirement: Linkable answers

Each question SHALL have its own link, and opening the FAQ with that link SHALL open and scroll to the answer.

#### Scenario: Shared answer link

- **WHEN** a customer opens /faq#how-to-pay from a WhatsApp message
- **THEN** the "How do I pay?" answer is open and in view

### Requirement: Safe formatted answers

Answers SHALL support paragraphs, bold text and links, and SHALL NOT render raw HTML.

#### Scenario: HTML in content

- **WHEN** an answer contains "<script>"
- **THEN** it is shown as text and not executed

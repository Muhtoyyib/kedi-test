## Purpose

Answers questions about the product in approved wording, plus the common ordering questions, with a WhatsApp fallback.

## ADDED Requirements

### Requirement: Product and ordering questions

The section SHALL list the product's own FAQs first, then answers to how to order, how to pay and delivery times, as expandable questions.

#### Scenario: Product with two FAQs

- **WHEN** a product has two FAQs in the Sheet
- **THEN** those two questions appear first, followed by the three ordering questions

#### Scenario: No product FAQs

- **WHEN** a product has no FAQs in the Sheet
- **THEN** only the three ordering questions are shown

### Requirement: Fallback to WhatsApp

The section SHALL end with an "Ask on WhatsApp" action naming the product.

#### Scenario: Unanswered question

- **WHEN** a visitor taps "Ask on WhatsApp" under the questions
- **THEN** WhatsApp opens with a message about that product

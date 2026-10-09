## Purpose

Provides the thank-you pages for the contact, business-interest, referral and seminar-interest forms, each with its own next step.

## ADDED Requirements

### Requirement: One page per form type

There SHALL be thank-you pages for contact, business, referral and seminar submissions, each with its own title, next steps and primary action, and any other kind SHALL show the not-found page.

#### Scenario: Contact form

- **WHEN** the contact form succeeds
- **THEN** /thank-you/contact shows "Message received" and asks the visitor to save the WhatsApp number

#### Scenario: Unknown kind

- **WHEN** a visitor opens /thank-you/anything
- **THEN** the not-found page is shown

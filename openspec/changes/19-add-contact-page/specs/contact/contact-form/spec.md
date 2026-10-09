## Purpose

Lets visitors who prefer a form send a message with consent, recorded in the Sheet as a lead.

## ADDED Requirements

### Requirement: Contact form submission

The form SHALL require name, a valid Nigerian WhatsApp number, a message of at least 5 characters and consent, accept an optional email and topic, and on success open the contact thank-you page.

#### Scenario: Valid message

- **WHEN** a visitor submits valid details with consent
- **THEN** the message is recorded as a lead from the contact form and the thank-you page opens

#### Scenario: Invalid email

- **WHEN** the optional email is filled with "abc"
- **THEN** the form shows "Enter a valid email or leave it empty"

### Requirement: No medical details

The form SHALL ask visitors not to include medical details.

#### Scenario: Form note

- **WHEN** a visitor views the contact form
- **THEN** the note "Please don't include medical details" is shown

## Purpose

Captures people interested in becoming distributors, with consent, into the client's Sheet for follow-up.

## ADDED Requirements

### Requirement: Interest capture with consent

The form SHALL require name, a valid Nigerian WhatsApp number, location and consent, and SHALL accept an optional occupation and question.

#### Scenario: Successful submission

- **WHEN** a visitor submits valid details with consent ticked
- **THEN** their details are recorded as a lead with business interest, and the business thank-you page opens

#### Scenario: Missing consent

- **WHEN** the consent box is not ticked
- **THEN** the form is not sent and the consent box shows "Please tick to agree so we can message you"

### Requirement: Clear failure handling

If the submission fails, the form SHALL keep the entered details, explain the problem, and offer WhatsApp as an alternative.

#### Scenario: Network failure

- **WHEN** the submission cannot reach the server
- **THEN** the form shows "Something went wrong. Please try again, or message us on WhatsApp." and the entered details remain

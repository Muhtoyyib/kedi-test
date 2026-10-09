## Purpose

Gives undecided visitors at the end of the home page a personal, low-pressure way to get advice on WhatsApp or join the seminar.

## ADDED Requirements

### Requirement: Personal help invitation

The final section SHALL ask "Not sure what you need?", offer a WhatsApp chat and the free seminar, and state the usual reply time.

#### Scenario: End of home page

- **WHEN** a visitor reaches the end of the home page
- **THEN** they see "Not sure what you need?", a "Chat with us on WhatsApp" button, a "Join the free seminar" button, and "We usually reply within 1 hour"

#### Scenario: Hours not set

- **WHEN** opening hours are not set in the Sheet
- **THEN** the reply line reads "We usually reply within 1 hour during business hours."

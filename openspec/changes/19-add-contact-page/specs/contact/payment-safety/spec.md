## Purpose

Protects customers from payment impersonators by publishing the official account and the rule that payment details only come from the official WhatsApp number.

## ADDED Requirements

### Requirement: Official payment details and warning

The contact page SHALL show the official bank name, account name and account number from the Sheet, and warn that payment details are only sent from the official WhatsApp number.

#### Scenario: Copy account number

- **WHEN** a visitor taps "Copy" next to the account number
- **THEN** the number is copied and "Account number copied" is announced

#### Scenario: Bank details not set

- **WHEN** the Sheet has no bank details
- **THEN** the warning is shown with "Ask us on WhatsApp for our payment details." and no account details

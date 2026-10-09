## Purpose

Gives every customer a personal, memorable referral code and link without an account, using only their first name and the last four digits of their phone number.

## ADDED Requirements

### Requirement: Deterministic personal codes

A referral code SHALL be the customer's first name in capital letters (Latin letters only, at most 12) followed by a hyphen and the last 4 digits of their phone number, and the same name and number SHALL always produce the same code.

#### Scenario: Typical name

- **WHEN** Amaka with phone 0803 123 4821 requests a code
- **THEN** the code is AMAKA-4821

#### Scenario: Name with accents

- **WHEN** Ọlá with phone 0909 000 1234 requests a code
- **THEN** the code is OLA-1234

#### Scenario: No usable letters

- **WHEN** the first name has fewer than 2 Latin letters
- **THEN** the code uses FRIEND, for example FRIEND-1234

### Requirement: Personal link

Each code SHALL have a link of the form {site}/?ref={CODE}.

#### Scenario: Link for a code

- **WHEN** the code AMAKA-4821 is created
- **THEN** the link is https://[domain]/?ref=AMAKA-4821

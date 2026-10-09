## Purpose

Remembers the referral code when a friend opens a referral link, and applies it to their order automatically for 30 days.

## ADDED Requirements

### Requirement: Referral links are remembered for 30 days

Opening any page with a valid ?ref= code SHALL remember the code on the visitor's device for 30 days, and a newer valid code SHALL replace an older one.

#### Scenario: Friend orders later

- **WHEN** a friend opens a referral link and orders 10 days later on the same phone
- **THEN** the referral code is pre-filled in their order

#### Scenario: Expired

- **WHEN** a friend orders 31 days after opening the link
- **THEN** no referral code is pre-filled

### Requirement: Invalid codes are ignored

A ?ref= value that does not match the code format SHALL be ignored.

#### Scenario: Garbage value

- **WHEN** a visitor opens /?ref=<script>
- **THEN** nothing is stored and the page renders normally

### Requirement: Clean addresses

After capturing the code, the ref parameter SHALL be removed from the address bar while other parameters are kept.

#### Scenario: Campaign link with ref

- **WHEN** a visitor opens /?ref=AMAKA-4821&utm_source=instagram
- **THEN** the address bar shows /?utm_source=instagram

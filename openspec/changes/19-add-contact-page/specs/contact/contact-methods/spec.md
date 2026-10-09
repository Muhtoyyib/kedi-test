## Purpose

Puts every contact channel (WhatsApp first, then phone and email, then socials) one tap away.

## ADDED Requirements

### Requirement: Contact channels

The contact page SHALL offer WhatsApp, a phone call and email as one-tap actions, with WhatsApp first and the expected reply time stated.

#### Scenario: Call

- **WHEN** a visitor taps "Call now"
- **THEN** the phone dialler opens with the business number

#### Scenario: Social link not configured

- **WHEN** the business has no TikTok link configured
- **THEN** no TikTok icon is shown

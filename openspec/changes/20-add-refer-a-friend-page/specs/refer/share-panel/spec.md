## Purpose

Lets customers share their referral link in one tap on WhatsApp, or copy the link or code.

## ADDED Requirements

### Requirement: One-tap WhatsApp share

"Share on WhatsApp" SHALL open WhatsApp with a ready-written message containing the personal link and the friend's reward, letting the customer choose the contact.

#### Scenario: Share

- **WHEN** a customer with code AMAKA-4821 taps "Share on WhatsApp"
- **THEN** WhatsApp opens with the referral message containing https://[domain]/?ref=AMAKA-4821 and asks which chat to send it to

### Requirement: Copy options

The panel SHALL let the customer copy the link and the code, confirming each copy.

#### Scenario: Copy link

- **WHEN** the customer taps "Copy link"
- **THEN** the link is copied and "Link copied" is announced

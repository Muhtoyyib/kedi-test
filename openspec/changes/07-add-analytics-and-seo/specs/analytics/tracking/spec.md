## Purpose

Measures the actions that matter (orders sent, seminar registrations, WhatsApp chats, form submissions) for weekly reviews and ad optimisation, only with consent and without personal data.

## ADDED Requirements

### Requirement: Consent-gated tracking

Analytics and advertising tags SHALL load only after the visitor accepts cookies, and events triggered before acceptance SHALL NOT be sent if the visitor declines.

#### Scenario: Accept after browsing

- **WHEN** a visitor adds a product to the cart and then accepts cookies on the same page
- **THEN** the add_to_cart event is sent after the tags load

#### Scenario: Decline

- **WHEN** a visitor declines cookies
- **THEN** no events are sent for the rest of their visits until they change their choice

### Requirement: Key actions are measured

The site SHALL send the events listed in the analytics event catalogue, including whatsapp_order_sent, seminar_register_click, whatsapp_chat_click (with its location) and form_submit.

#### Scenario: Order sent

- **WHEN** a consenting visitor sends an order on WhatsApp
- **THEN** a whatsapp_order_sent event with the order ID, item count and value is sent to GA4 and a Lead event to the Meta Pixel

### Requirement: No personal data in analytics

Events SHALL NOT contain names, phone numbers, addresses, emails or free-text form content.

#### Scenario: Contact form submitted

- **WHEN** a consenting visitor submits the contact form
- **THEN** the form_submit event contains only the form ID

## Purpose

Lets visitors register for the seminar through Luma without slowing the page, and still captures their interest when Luma is unavailable.

## ADDED Requirements

### Requirement: Registration loads on request

The Luma registration form SHALL load only when the visitor taps "Register free" or arrives at the registration section directly, and its space SHALL be reserved so the page does not jump.

#### Scenario: Normal page load

- **WHEN** a visitor opens the seminars page
- **THEN** no Luma content is requested until they tap "Register free"

#### Scenario: Link to the registration section

- **WHEN** a visitor opens /seminars#register
- **THEN** the page scrolls to registration and the Luma form loads

### Requirement: Direct registration link

The section SHALL always offer a direct link to the seminar's Luma registration page.

#### Scenario: In-app browser problems

- **WHEN** a visitor taps "Or open the registration page"
- **THEN** the Luma event page opens in a new tab

### Requirement: Fallback interest form

If the seminar has no Luma event or the form fails to load within 10 seconds, the section SHALL show a short form (name, WhatsApp number, consent) that records the visitor's interest in the Sheet.

#### Scenario: Luma unavailable

- **WHEN** the Luma form has not loaded after 10 seconds
- **THEN** the fallback form is shown
- **AND** submitting it with consent records the visitor and opens the seminar thank-you page

#### Scenario: Consent not ticked

- **WHEN** the visitor submits the fallback form without ticking consent
- **THEN** the form is not sent and the consent box shows "Please tick to agree so we can message you"

### Requirement: Explain what happens next

The section SHALL explain that registration is free, that the visitor should save the WhatsApp number, and when reminders arrive.

#### Scenario: Registration section

- **WHEN** a visitor views the registration section
- **THEN** the four "What happens next" steps are shown

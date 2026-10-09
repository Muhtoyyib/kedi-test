## Purpose

Tells a first-time visitor within five seconds who the business is, where it serves, and how to shop, join a free seminar or chat on WhatsApp.

## ADDED Requirements

### Requirement: Promise and location

The hero SHALL show the headline "Your trusted KEDI wellness partner in {City}" and identify the business as an independent KEDI distributor.

#### Scenario: First view on a phone

- **WHEN** a visitor opens the home page on a 360×640 screen
- **THEN** the headline, the "Shop products" button, the seminar button and the WhatsApp link are visible without scrolling

### Requirement: Seminar action reflects the schedule

The hero's seminar button SHALL read "Join this week's free seminar" when the next seminar starts within 7 days, "Join our next free seminar" when it is later, and "See upcoming seminars" when none is scheduled, and SHALL link to the seminar registration.

#### Scenario: Seminar in 3 days

- **WHEN** the next scheduled seminar starts in 3 days
- **THEN** the button reads "Join this week's free seminar"

#### Scenario: No seminar scheduled

- **WHEN** no future seminar is scheduled
- **THEN** the button reads "See upcoming seminars" and opens the seminars page

### Requirement: WhatsApp help from the hero

The hero SHALL offer "Not sure what you need? Chat with us on WhatsApp", opening a chat with the general advice message.

#### Scenario: Tap the help link

- **WHEN** a visitor taps the hero WhatsApp link
- **THEN** WhatsApp opens to the business number with the general advice message

### Requirement: Real person, fast image

The hero SHALL show a photo of the distributor that loads first on the page and does not shift the layout.

#### Scenario: Slow 4G

- **WHEN** the home page loads on a slow 4G connection
- **THEN** the hero photo's space is reserved before it loads and the largest content paint happens within 2.5 seconds

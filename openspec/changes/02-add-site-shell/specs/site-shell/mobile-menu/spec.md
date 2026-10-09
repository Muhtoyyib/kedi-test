## Purpose

Gives phone visitors one-tap access to every page plus WhatsApp, phone and opening hours from a single menu.

## ADDED Requirements

### Requirement: Full navigation on small screens

On screens narrower than 1024px, the menu SHALL list every public page section and offer WhatsApp and phone actions with the opening hours.

#### Scenario: Open menu on a phone

- **WHEN** a visitor on a 360px screen taps the menu button
- **THEN** a menu opens listing Shop, Seminars, Learn, Customer stories, Business opportunity, Refer a friend, About us, FAQ and Contact
- **AND** a WhatsApp button, a call button and the opening hours are shown

### Requirement: Menu closes predictably

The menu SHALL close when the visitor selects a link, taps close, or presses Escape, and the page behind SHALL NOT scroll while it is open.

#### Scenario: Choose a page

- **WHEN** a visitor taps "Seminars" in the open menu
- **THEN** the seminars page opens and the menu is closed

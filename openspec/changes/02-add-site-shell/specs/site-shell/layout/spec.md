## Purpose

Gives every page the same frame and landmark structure, so visitors and assistive technology always find navigation, content and footer in the same places.

## ADDED Requirements

### Requirement: Consistent page frame

Every public page SHALL render inside the same frame: header, one main content region, footer, floating WhatsApp button (unless the page hides it) and the cookie consent bar until consent is decided.

#### Scenario: Any page

- **WHEN** a visitor opens any public page
- **THEN** the page has exactly one header, one main region and one footer

### Requirement: Skip to content

The first focusable element on every page SHALL be a "Skip to content" link that moves focus to the main region.

#### Scenario: Keyboard user

- **WHEN** a keyboard user presses Tab once after the page loads and then Enter
- **THEN** focus moves to the start of the main content

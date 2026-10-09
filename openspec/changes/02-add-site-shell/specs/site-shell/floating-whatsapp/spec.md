## Purpose

Keeps a one-tap WhatsApp chat within thumb reach on every page, because chatting is how most customers start buying.

## ADDED Requirements

### Requirement: Always-available WhatsApp button

Every page SHALL show a floating WhatsApp button in the bottom-right corner, except pages that provide their own sticky WhatsApp action.

#### Scenario: Scrolling any page

- **WHEN** a visitor scrolls anywhere on the home page
- **THEN** the floating WhatsApp button stays visible in the bottom-right corner

#### Scenario: Product page

- **WHEN** a visitor views a product page that shows a sticky buy bar with WhatsApp
- **THEN** the floating button is not shown

### Requirement: Gentle one-time prompt

After 20 seconds on a page, the site SHALL show the "Need help choosing? Chat with us" prompt once per browsing session, unless the visitor has already opened WhatsApp, the cart or the menu, and SHALL let the visitor close it.

#### Scenario: Prompt once per session

- **WHEN** a visitor closes the prompt and opens another page in the same session
- **THEN** the prompt does not appear again

### Requirement: Button does not hide other controls

The floating button SHALL NOT cover the cookie consent buttons or the last line of the footer.

#### Scenario: Cookie bar showing on a phone

- **WHEN** the cookie bar is visible on a 360px screen
- **THEN** the floating button sits above the cookie bar

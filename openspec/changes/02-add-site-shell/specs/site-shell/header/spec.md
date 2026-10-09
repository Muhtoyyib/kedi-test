## Purpose

Makes the business identity, its independent relationship to KEDI, and the main actions (shop, cart, WhatsApp) available at the top of every page.

## ADDED Requirements

### Requirement: Independent distributor identity

The header SHALL show the business's own name or wordmark with the line "Independent KEDI Distributor", and SHALL NOT use the KEDI logo as the site logo.

#### Scenario: Any page header

- **WHEN** a visitor views the header
- **THEN** the business name and "Independent KEDI Distributor" are visible

### Requirement: WhatsApp reachable from the header

The header SHALL offer a WhatsApp action on every screen size that opens a chat with the business number and a pre-filled greeting.

#### Scenario: Mobile tap

- **WHEN** a visitor on a 360px screen taps the header WhatsApp button
- **THEN** WhatsApp opens a chat with the business number and the general advice message

### Requirement: Cart access and count

The header SHALL show a cart button with the number of items in the cart once the page is interactive, and SHALL hide the count when the cart is empty.

#### Scenario: Items in cart

- **WHEN** the cart holds 3 items and the visitor opens any page
- **THEN** the cart button shows 3 and its accessible name includes "3 items"

### Requirement: Current page indicated

The navigation SHALL mark the link for the current section of the site.

#### Scenario: Category page

- **WHEN** a visitor is on a shop category page
- **THEN** the "Shop" navigation link is marked as current

### Requirement: Header stays available

The header SHALL remain visible at the top of the screen while the visitor scrolls.

#### Scenario: Long page

- **WHEN** a visitor scrolls down a long page
- **THEN** the header and its WhatsApp and cart buttons stay visible

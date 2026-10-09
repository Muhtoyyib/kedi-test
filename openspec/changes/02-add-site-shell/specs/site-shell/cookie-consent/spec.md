## Purpose

Asks visitors before any analytics or advertising cookies are set, records the choice, and lets them change it, as required for NDPA compliance.

## ADDED Requirements

### Requirement: No tracking before consent

The site SHALL NOT load analytics or advertising scripts, or set their cookies, until the visitor accepts.

#### Scenario: First visit

- **WHEN** a first-time visitor opens any page and has not answered the cookie bar
- **THEN** no analytics or advertising scripts are requested

#### Scenario: Decline

- **WHEN** the visitor taps Decline
- **THEN** no analytics or advertising scripts load on this or later pages

### Requirement: Clear, non-blocking choice

The cookie bar SHALL be dismissible only by choosing Accept or Decline, SHALL NOT block reading or using the page, and SHALL link to the privacy policy.

#### Scenario: Using the page with the bar open

- **WHEN** the cookie bar is showing
- **THEN** the visitor can still scroll, read and tap links on the page

### Requirement: Choice is remembered and changeable

The site SHALL remember the choice for 6 months and SHALL let the visitor reopen the choice from "Cookie settings" in the footer.

#### Scenario: Returning visitor

- **WHEN** a visitor who accepted 2 months ago returns
- **THEN** the cookie bar is not shown and analytics load

#### Scenario: Withdraw consent

- **WHEN** a visitor who accepted opens Cookie settings and taps Decline
- **THEN** analytics cookies on the site's domain are removed and analytics stop loading

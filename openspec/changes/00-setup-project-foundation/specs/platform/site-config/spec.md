## Purpose

Keeps every brand and contact value (name, phone, WhatsApp, address, socials, links) in one typed place, so a value changes once and never drifts between pages.

## ADDED Requirements

### Requirement: Brand values have one source

The site SHALL read the brand name, distributor name, city, phone, WhatsApp number, email, address, social links and Luma calendar from a single site configuration, and no page SHALL hardcode them.

#### Scenario: Changing the WhatsApp number

- **WHEN** the WhatsApp number is changed in the site configuration and the site is rebuilt
- **THEN** every WhatsApp link on every page uses the new number

### Requirement: Page titles follow one pattern

Page titles SHALL be "{Page title} | {Brand name}", and the home page title SHALL be "{Brand name} — {tagline}".

#### Scenario: Shop page title

- **WHEN** the shop page is rendered
- **THEN** the document title is "Shop KEDI products | {Brand name}"

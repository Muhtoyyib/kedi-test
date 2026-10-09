## Purpose

Guarantees the site looks like part of the KEDI family (blue and sun-yellow) while staying readable for every visitor, by fixing one palette, type scale and spacing that all pages use.

## ADDED Requirements

### Requirement: KEDI-derived palette

The site SHALL use KEDI Blue (#317ABE) as its primary action colour and KEDI Sun (#F4E028) as its highlight colour, with Navy (#0F2A47) for headings and dark panels.

#### Scenario: Primary action colour

- **WHEN** any primary button is rendered
- **THEN** its background is KEDI Blue and its text is white

#### Scenario: Highlight use

- **WHEN** an offer or "this week" highlight is rendered
- **THEN** it uses a KEDI Sun background with Navy text

### Requirement: Readable contrast

All text SHALL meet WCAG AA contrast (4.5:1 for normal text, 3:1 for text 24px and larger or bold 19px and larger) against its background, and yellow SHALL NOT be used as a text colour on light backgrounds.

#### Scenario: WhatsApp button text

- **WHEN** a WhatsApp button is rendered
- **THEN** its label is dark green (#0B2E1A) on WhatsApp green, not white

#### Scenario: Muted helper text

- **WHEN** helper text appears on the light surface background
- **THEN** its contrast ratio is at least 4.5:1

### Requirement: Readable body text on phones

Paragraph text SHALL be at least 16px with line height of at least 1.5 on every screen size.

#### Scenario: Small phone

- **WHEN** a page is viewed at 360px wide
- **THEN** paragraph text is 16px or larger and no text overflows horizontally

## Purpose

Lists what attendees will learn at the next seminar and is upfront, without pressure, about the optional seminar-only offer.

## ADDED Requirements

### Requirement: Learning points

The section SHALL list the next seminar's learning points from the Sheet, or a standard set of three when none are provided.

#### Scenario: Points provided

- **WHEN** the next seminar has three learning points
- **THEN** those three points are listed

### Requirement: Honest offer note

When a seminar offer is set in the Sheet, the section SHALL describe it as optional with no pressure to buy.

#### Scenario: Offer set

- **WHEN** seminar_offer_text is "10% off for 48 hours after the seminar."
- **THEN** the note shows that text and says "There's no pressure to buy."

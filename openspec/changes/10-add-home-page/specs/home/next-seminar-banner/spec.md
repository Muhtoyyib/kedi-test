## Purpose

Promotes the next free weekly seminar on the home page with a one-tap registration, and never advertises a seminar that has already started.

## ADDED Requirements

### Requirement: Next seminar details

The banner SHALL show the next scheduled seminar's day and date, topic, start and end time in WAT, whether it is in person (with venue) or online, a short summary, and a "Register free" action.

#### Scenario: Physical seminar

- **WHEN** the next seminar is in person on Saturday 12 October at 4:00 PM
- **THEN** the banner shows "Saturday, 12 October", "4:00 PM – 5:30 PM WAT", the venue and "Register free"

#### Scenario: Register

- **WHEN** a visitor taps "Register free"
- **THEN** the seminars page opens at the registration section

### Requirement: Never stale

The banner SHALL re-check the time in the visitor's browser and SHALL show the following seminar, or the coming-soon state, once the advertised seminar has started.

#### Scenario: Seminar already started

- **WHEN** a visitor opens the home page 10 minutes after the advertised seminar began
- **THEN** the banner shows the next scheduled seminar instead, or the coming-soon state

### Requirement: Coming-soon state

When no future seminar is scheduled, the banner SHALL say new dates are coming soon and offer to get notified of every seminar.

#### Scenario: Empty schedule

- **WHEN** no seminar is scheduled
- **THEN** the banner shows "New seminar dates are coming soon" and a "Get notified of every seminar" action that opens the Luma calendar

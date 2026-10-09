## Purpose

Lets the client show one short, optional announcement across the whole site from the Sheet, which visitors can dismiss.

## ADDED Requirements

### Requirement: Announcement shown only when set

The site SHALL show the announcement bar on every page only when the Sheet has announcement text, and SHALL show nothing when it is blank.

#### Scenario: No announcement

- **WHEN** the announcement text in the Sheet is empty
- **THEN** no announcement bar is rendered

#### Scenario: Announcement with link

- **WHEN** the Sheet has announcement text and a link
- **THEN** the bar shows the text and tapping it opens the link

### Requirement: Dismissal is remembered per message

A dismissed announcement SHALL stay hidden for that visitor for 7 days, and a new announcement text SHALL appear even if the previous one was dismissed.

#### Scenario: Dismiss and return

- **WHEN** a visitor dismisses the bar and opens another page the same day
- **THEN** the bar is not shown

#### Scenario: New message

- **WHEN** the client changes the announcement text and the site is republished
- **THEN** a visitor who dismissed the old text sees the new one

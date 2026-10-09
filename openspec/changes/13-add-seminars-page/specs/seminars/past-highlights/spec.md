## Purpose

Shows photos, clips and attendee comments from recent seminars to prove they are real and worthwhile.

## ADDED Requirements

### Requirement: Recent highlights

The section SHALL show up to three most recent seminar highlights with topic, date, photos and, when available, a video clip and an attendee comment.

#### Scenario: Highlight with clip

- **WHEN** a highlight includes a video clip
- **THEN** a video preview is shown that plays only when tapped

### Requirement: Hidden when empty

The section SHALL NOT render when there are no highlights.

#### Scenario: First weeks after launch

- **WHEN** no highlights have been added
- **THEN** the seminars page has no highlights section

## Purpose

Shows the next free seminar's topic, date, time, place and audience at the top of the seminars page, with one-tap registration and sharing.

## ADDED Requirements

### Requirement: Next seminar at a glance

The top of the page SHALL show the next seminar's topic as the main heading, its date, start and end time in WAT with duration, whether it is in person (with venue and directions) or online, who should attend, and that it is free.

#### Scenario: Online seminar

- **WHEN** the next seminar is online on YouTube Live
- **THEN** the page shows "Online: YouTube Live" and "Link sent after you register" instead of a venue

#### Scenario: Seminar today

- **WHEN** the visitor opens the page on the day of the seminar before it starts
- **THEN** the page shows "Starts today at {time}"

### Requirement: Register and share

The section SHALL offer "Register free", which takes the visitor to registration, and a share action that sends the seminar details to a friend.

#### Scenario: Register

- **WHEN** a visitor taps "Register free"
- **THEN** the page scrolls to the registration section and the registration form starts loading

### Requirement: No upcoming seminar

When no seminar is scheduled, the section SHALL say the next date is coming soon and offer seminar notifications and a WhatsApp question.

#### Scenario: Empty schedule

- **WHEN** no future seminar is scheduled
- **THEN** the heading reads "Our next seminar date is coming soon" with "Get notified of every seminar" and "Ask us on WhatsApp"

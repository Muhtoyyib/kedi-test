## Purpose

Shows later seminar dates and lets visitors subscribe to be notified of every future seminar.

## ADDED Requirements

### Requirement: Later seminars listed

The page SHALL list up to four scheduled seminars after the next one, each with date, time, topic, format and a Register link to its own registration page.

#### Scenario: Three later seminars

- **WHEN** four future seminars are scheduled
- **THEN** the first is featured at the top and the other three are listed under "Coming up"

#### Scenario: No later seminars

- **WHEN** only one future seminar is scheduled
- **THEN** "Coming up" shows "More dates will be added soon."

### Requirement: Calendar subscription

The page SHALL offer "Get notified of every seminar", opening the Luma calendar subscription, and a link to the WhatsApp Channel.

#### Scenario: Subscribe

- **WHEN** a visitor taps "Get notified of every seminar"
- **THEN** the Luma calendar page opens in a new tab

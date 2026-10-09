## Purpose

Defines the customer stories page: its sections, its metadata, and its behaviour before any stories exist.

## ADDED Requirements

### Requirement: Stories page

/stories SHALL show the intro, written stories, video stories (if any) and the invitation to share a story, and each story SHALL be linkable by its own anchor.

#### Scenario: Deep link from home

- **WHEN** a visitor follows a link to /stories#ngozi-a
- **THEN** the page scrolls to that story

#### Scenario: No stories yet

- **WHEN** no stories are published
- **THEN** the page shows the intro saying the first stories are on the way and the invitation to share a story

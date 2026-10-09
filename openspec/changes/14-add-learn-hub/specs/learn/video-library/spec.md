## Purpose

Shows short wellness videos on the hub without slowing the page, loading each video only when tapped.

## ADDED Requirements

### Requirement: Video previews load on tap

The hub SHALL show video previews with titles and durations, and SHALL load a video player only when its preview is tapped.

#### Scenario: Open hub

- **WHEN** a reader opens /learn
- **THEN** no video player iframes are requested

#### Scenario: Play a video

- **WHEN** the reader taps a video preview
- **THEN** that video starts playing in place

### Requirement: Hidden when empty

The video section SHALL NOT render when there are no videos.

#### Scenario: No videos listed

- **WHEN** the video list is empty
- **THEN** the hub has no video section

## Purpose

Lets readers narrow articles and videos to one wellness topic.

## ADDED Requirements

### Requirement: Filter by topic

The hub SHALL show a chip for each topic that has at least one article, and selecting one SHALL show only that topic's articles and videos and record the topic in the page address.

#### Scenario: Choose Digestion

- **WHEN** a reader taps "Digestion (3)"
- **THEN** only the three digestion articles (and digestion videos) are listed and the address includes ?topic=digestion

#### Scenario: Unknown topic in the address

- **WHEN** a reader opens /learn?topic=unknown
- **THEN** all articles are shown

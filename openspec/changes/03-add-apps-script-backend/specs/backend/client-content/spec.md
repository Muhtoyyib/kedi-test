## Purpose

Lets the client publish seminar highlights, videos, customer stories and articles from the Google Sheet and Google Docs, without a developer, while blocking anything unsafe or non-compliant.

## ADDED Requirements

### Requirement: Client content in the catalog

The catalog SHALL include active Highlights, Videos and Stories rows, and Articles rows marked Ready = Yes, in the typed shapes the website uses.

#### Scenario: Article not ready

- **WHEN** an Articles row has Ready = No
- **THEN** the article is not in the catalog

#### Scenario: New video

- **WHEN** the client adds an active Videos row with a YouTube Shorts link
- **THEN** the catalog contains the video with provider youtube and its video ID

#### Scenario: Unsupported video link

- **WHEN** a Videos row contains a link that isn't YouTube or TikTok
- **THEN** "Check content for errors" reports the row as an error and publishing is blocked

### Requirement: Stories only with consent

A story SHALL be published only when it has a consent date, its photo only when photo consent is Yes, and its video only when video consent is Yes.

#### Scenario: Missing consent date

- **WHEN** a Stories row has no consent date
- **THEN** the story is left out of the catalog and "Check content for errors" warns that it isn't published

#### Scenario: No photo consent

- **WHEN** a story has a photo but photo consent is No
- **THEN** the story is published without the photo

#### Scenario: Full name entered

- **WHEN** a story's name is "Ngozi Adeyemi"
- **THEN** the check reports "Use first name and initial only, e.g. Ngozi A." and publishing is blocked

### Requirement: Articles written in Google Docs

Each ready article's Google Doc SHALL be converted into headings, paragraphs (with bold, italic and safe links), lists, images with alt text, embedded videos (from a link on its own line) and the "When to see a doctor" box, and any other formatting SHALL be ignored with a warning.

#### Scenario: Doctor section

- **WHEN** a Doc has a Heading 2 "When to see a doctor" followed by two paragraphs
- **THEN** those two paragraphs appear inside the "When to see a doctor" box on the website

#### Scenario: Table in a Doc

- **WHEN** a Doc contains a table
- **THEN** the table is left out and "Check content for errors" warns that tables aren't shown

#### Scenario: Doc not shared

- **WHEN** an article's Doc cannot be opened by the Sheet's account
- **THEN** the check reports an error asking the client to share the Doc, and publishing is blocked

### Requirement: No health claims in client-written content

Article text (outside the "When to see a doctor" section), story text and highlight comments SHALL NOT contain banned health-claim words, and such content SHALL block publishing with a message naming the item and the word.

#### Scenario: Claim in an article

- **WHEN** an article paragraph says a habit "cures ulcers"
- **THEN** "Check content for errors" reports the article ID, the paragraph and the word, and publishing is blocked

#### Scenario: Inside the doctor section

- **WHEN** the "When to see a doctor" section mentions a disease name
- **THEN** no error is reported

### Requirement: Article template

The Sheet SHALL provide "New article from template", which creates a new formatted Doc in the Website Articles folder and adds a matching Articles row with Ready = No.

#### Scenario: Start an article

- **WHEN** the client chooses "New article from template"
- **THEN** a new Doc opens in the Website Articles folder and a new Articles row links to it

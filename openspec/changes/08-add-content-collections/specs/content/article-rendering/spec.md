## Purpose

Displays articles and stories written by the client in a consistent, accessible format, keeping only the supported formatting and never running code from the content.

## ADDED Requirements

### Requirement: Supported article formatting

Articles SHALL display section headings, sub-headings, paragraphs with bold, italic and links, bulleted and numbered lists, images with alt text, embedded videos and the "When to see a doctor" box.

#### Scenario: Article with an image

- **WHEN** an article contains an image with alt text
- **THEN** the image is shown at a size suited to the screen, with the alt text available to screen readers

#### Scenario: Doctor box

- **WHEN** an article has a "When to see a doctor" section
- **THEN** that section appears in a highlighted information box titled "When to see a doctor"

### Requirement: Links behave safely

Links to other sites SHALL open in a new tab without giving that site access to the page, and links to pages on this site SHALL open in place.

#### Scenario: External link

- **WHEN** a reader taps a link to another website in an article
- **THEN** it opens in a new tab

### Requirement: No code from content

Text from articles and stories SHALL always be displayed as text, and SHALL never be run as code or inserted as HTML.

#### Scenario: Script text in a Doc

- **WHEN** an article paragraph contains the text "<script>alert(1)</script>"
- **THEN** the text is shown literally and nothing runs

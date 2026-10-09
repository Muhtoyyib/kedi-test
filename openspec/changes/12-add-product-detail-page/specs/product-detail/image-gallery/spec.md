## Purpose

Lets buyers inspect every photo of the product pack, by swiping on phones or with thumbnails on larger screens, and zoom in.

## ADDED Requirements

### Requirement: Browse all product photos

The gallery SHALL show every product image, swipeable on phones with position indicators, and with thumbnails on larger screens.

#### Scenario: Three photos on a phone

- **WHEN** a visitor swipes the gallery of a product with three photos
- **THEN** each photo is shown in turn and the indicator shows which photo is visible

#### Scenario: One photo

- **WHEN** a product has a single photo
- **THEN** no thumbnails or indicators are shown

### Requirement: Zoom

Tapping a photo SHALL open a full-screen view with a larger version, which closes with a close button, Escape or swipe down.

#### Scenario: Check the label

- **WHEN** a visitor taps the main photo
- **THEN** a full-screen view of that photo opens

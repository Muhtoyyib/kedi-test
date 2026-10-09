## Purpose

Defines how the shared interactive building blocks behave (buttons, form fields, drawer, accordion, toast, images and videos), so every page gets the same accessible behaviour.

## ADDED Requirements

### Requirement: Touch-friendly controls

Every interactive control SHALL have a touch target of at least 44 by 44 CSS pixels and a visible focus indicator when focused with a keyboard.

#### Scenario: Keyboard focus

- **WHEN** a visitor tabs to a button or link
- **THEN** a visible focus ring appears around it

### Requirement: Labelled form fields

Every form field SHALL have a visible label, and validation errors SHALL be shown as text next to the field and announced to screen readers.

#### Scenario: Invalid phone number

- **WHEN** a visitor submits a form with "12345" as the phone number
- **THEN** the phone field shows "Enter a Nigerian mobile number, e.g. 0803 123 4567"
- **AND** the field is marked invalid for assistive technology

#### Scenario: Phone formats accepted

- **WHEN** a visitor enters 08031234567, 8031234567, +2348031234567 or 2348031234567
- **THEN** each is accepted and stored as +2348031234567

### Requirement: Accessible drawer

The drawer SHALL trap focus while open, close on Escape or overlay tap, and return focus to the control that opened it.

#### Scenario: Close with Escape

- **WHEN** the drawer is open and the visitor presses Escape
- **THEN** the drawer closes and focus returns to the button that opened it

### Requirement: Accordions work without JavaScript

Question-and-answer lists SHALL expand and collapse without JavaScript.

#### Scenario: No JavaScript

- **WHEN** JavaScript is disabled and a visitor taps a question
- **THEN** the answer is shown

### Requirement: Videos load only on request

Embedded videos SHALL show a lightweight preview and load the video player only after the visitor taps play.

#### Scenario: Page load with a video

- **WHEN** a page containing a video loads
- **THEN** no video player iframe is requested until the visitor taps the play button

### Requirement: Images do not shift the layout

Images SHALL reserve their space before loading and serve a size suited to the screen.

#### Scenario: Slow connection

- **WHEN** a product image loads slowly on a 360px screen
- **THEN** the surrounding content does not move when the image appears
- **AND** the image file requested is no wider than 768 pixels

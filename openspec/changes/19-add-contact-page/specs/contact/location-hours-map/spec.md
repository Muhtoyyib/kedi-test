## Purpose

Shows where to find the business and when it is open, with directions and a map that loads only on request.

## ADDED Requirements

### Requirement: Address, hours and directions

The contact page SHALL show the address, opening hours and a "Get directions" link.

#### Scenario: Directions

- **WHEN** a visitor taps "Get directions"
- **THEN** Google Maps opens searching for the business location

### Requirement: Map on request

The map SHALL load only after the visitor taps "Show map".

#### Scenario: Page load

- **WHEN** the contact page loads
- **THEN** no Google Maps content is requested until "Show map" is tapped

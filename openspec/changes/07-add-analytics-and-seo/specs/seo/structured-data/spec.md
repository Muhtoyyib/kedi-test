## Purpose

Describes the business, products, seminars, FAQs and articles to search engines in schema.org form, so they can show rich results and local listings, without implying the business is KEDI itself.

## ADDED Requirements

### Requirement: Local business identity

Every page SHALL include structured data describing the business as a local business with its name, address, phone, opening hours, service areas and social profiles, and SHALL NOT declare KEDI as its parent organisation.

#### Scenario: Home page

- **WHEN** the home page is tested with a structured-data validator
- **THEN** a LocalBusiness entity with the business name and address is found and no parentOrganization is declared

### Requirement: Product data

Each product page SHALL include Product data with name, image, description, brand KEDI, and an Offer with price in NGN and availability when a price is published.

#### Scenario: Ask-for-price product

- **WHEN** a product has no published price
- **THEN** its Product data has no Offer

#### Scenario: Out of stock

- **WHEN** a product is out of stock
- **THEN** its Offer availability is OutOfStock

### Requirement: Seminar events

The seminars page SHALL include Event data for each upcoming scheduled seminar, with start and end times in West Africa Time, attendance mode, location or online URL, and a free offer.

#### Scenario: Online seminar

- **WHEN** the next seminar is online
- **THEN** its Event data uses the online attendance mode and a virtual location

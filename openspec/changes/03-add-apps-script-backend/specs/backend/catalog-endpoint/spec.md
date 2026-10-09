## Purpose

Gives the website build a validated, read-only copy of the client's products, categories, settings, delivery fees and seminar schedule, and the product photos, without making the Sheet or Drive public.

## ADDED Requirements

### Requirement: Token-protected catalog read

The catalog and image endpoints SHALL return data only when the request carries the correct read token.

#### Scenario: Wrong token

- **WHEN** the catalog is requested with a missing or wrong token
- **THEN** the response is `{ok:false, code:"unauthorized"}` and contains no data

### Requirement: Only valid, active data is served

The catalog SHALL include only rows marked active and SHALL report validation errors instead of returning a partial catalog.

#### Scenario: Product with an unknown category

- **WHEN** a product's category does not match any category
- **THEN** the catalog response is an error that names the product ID, the row number and the problem

#### Scenario: Inactive product

- **WHEN** a product is marked active = No
- **THEN** it is absent from the catalog

### Requirement: Approved-wording warnings

The catalog check SHALL warn, without blocking, when product text contains words such as "cure", "treat", "heal", "prevent" or disease names, asking the client to confirm the wording is KEDI-approved.

#### Scenario: Risky word

- **WHEN** a product description contains "cures"
- **THEN** "Check content for errors" lists a warning for that product and publishing is still allowed

## Purpose

Defines the product page at /products/{slug}: what it contains, the order of sections, and its search metadata.

## ADDED Requirements

### Requirement: One page per active product

Each active product SHALL have a page at /products/{slug}, and unknown or inactive slugs SHALL show the not-found page.

#### Scenario: Inactive product link

- **WHEN** a visitor opens the link of a product that was made inactive
- **THEN** the not-found page is shown with links to the shop

### Requirement: Approved information only

All product descriptions, ingredients, usage and product FAQs on the page SHALL be the Sheet's approved text, without added claims.

#### Scenario: Text audit

- **WHEN** the rendered page text is compared with the Sheet fields
- **THEN** every product-specific sentence matches a Sheet field

### Requirement: Product search metadata

The page title and description SHALL come from the product's SEO fields (or their defaults), and the page SHALL include Product and breadcrumb structured data.

#### Scenario: Default SEO title

- **WHEN** a product has no SEO title in the Sheet
- **THEN** its page title is "{name} — {pack size} | {Brand}"

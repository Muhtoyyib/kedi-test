## Purpose

Gives each category its own landing page with a heading, description, breadcrumbs and search metadata, for visitors arriving from search and ads.

## ADDED Requirements

### Requirement: Category heading and description

Each category page SHALL show breadcrumbs (Home › Shop › Category), the category name as the main heading, its description and its product count.

#### Scenario: Category landing from Google

- **WHEN** a visitor lands on /shop/immunity
- **THEN** the page heading is "Immunity", followed by its description and "4 products"

### Requirement: Category search data

Each category page SHALL provide breadcrumb and product-list structured data.

#### Scenario: Structured data check

- **WHEN** the category page is tested with a structured-data validator
- **THEN** a BreadcrumbList with Home, Shop and the category is found

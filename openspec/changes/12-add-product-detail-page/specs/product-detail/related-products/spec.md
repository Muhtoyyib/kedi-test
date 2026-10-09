## Purpose

Suggests up to four other products the client has marked as related, or others from the same category, below the product details.

## ADDED Requirements

### Requirement: Related suggestions

The page SHALL show up to four related products, never including the current product, using the client's chosen related products first and otherwise products from the same category.

#### Scenario: Client set related products

- **WHEN** the Sheet lists two related products for this product
- **THEN** those two appear first, followed by same-category products up to four

#### Scenario: Only product in its category with none set

- **WHEN** no related products are set and the category has no other products
- **THEN** other products fill the list, or the section is hidden if there are none

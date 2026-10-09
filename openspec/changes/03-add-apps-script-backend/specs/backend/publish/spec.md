## Purpose

Lets the client publish Sheet changes (prices, stock, products, seminars) to the live website with one menu click and see whether it worked.

## ADDED Requirements

### Requirement: One-click publish

The Sheet SHALL offer "KEDI Website → Publish website", which checks all content (products, seminars, highlights, videos, stories and articles) and, if there are no errors, starts a website deploy.

#### Scenario: Valid data

- **WHEN** the client clicks Publish website and the data has no errors
- **THEN** a deploy starts, the Publish Log shows "Requested", and the client sees "Publishing… your site updates in about 3 minutes."

#### Scenario: Data errors

- **WHEN** the client clicks Publish website and a product has a non-numeric price
- **THEN** no deploy starts and a dialog lists each error with its row

### Requirement: Publish result visible in the Sheet

The Publish Log SHALL show whether each publish went live or failed, with a link to the run.

#### Scenario: Build fails

- **WHEN** the deploy fails
- **THEN** the Publish Log row shows "Failed" with the run link, and the website keeps its previous version

## Purpose

Defines how the website is built into static pages and deployed, and the conditions that must stop a deploy so a broken or half-configured site never replaces the live one.

## ADDED Requirements

### Requirement: Every page is static HTML

The build SHALL prerender every public route to a static HTML file, so that page content is readable without JavaScript.

#### Scenario: Page readable without JavaScript

- **WHEN** a visitor loads any public page with JavaScript disabled
- **THEN** the page's headings, text, images and links are present in the HTML response

#### Scenario: Prerender failure stops the build

- **WHEN** any listed route throws during prerender
- **THEN** the build fails and nothing is deployed

### Requirement: Unknown paths return a real 404

The hosting SHALL respond to unknown paths with HTTP status 404 and the site's not-found page.

#### Scenario: Mistyped URL

- **WHEN** a visitor requests `/prodcts/abc`
- **THEN** the response status is 404
- **AND** the body is the site's not-found page with links back to Shop and Home

### Requirement: Deploys are triggered three ways

The site SHALL be rebuilt and deployed on a push to the main branch, once every night, and when the client presses "Publish website" in the Sheet.

#### Scenario: Nightly rebuild

- **WHEN** 01:00 WAT passes
- **THEN** a build runs with fresh Sheet data and deploys if it succeeds

#### Scenario: Concurrent triggers

- **WHEN** a publish is requested while another deploy is running
- **THEN** the second deploy waits and runs after the first finishes

### Requirement: Production deploys refuse incomplete builds

A production deploy SHALL fail, leaving the previous version live, if the catalog came from the development fixture, if any brand or contact value is still a placeholder, or if the site URL is not configured as HTTPS.

#### Scenario: Placeholder left in config

- **WHEN** `[Brand Name]` is still present in the site configuration during a production deploy
- **THEN** the deploy fails with a message naming the placeholder
- **AND** the live site is unchanged

#### Scenario: Fixture catalog

- **WHEN** the generated catalog is marked as fixture data during a production deploy
- **THEN** the deploy fails

#### Scenario: Preview builds

- **WHEN** a pull request preview is built
- **THEN** fixture data and placeholders are allowed

## Purpose

States the referral reward for both the customer and their friend as the first thing on the page.

## ADDED Requirements

### Requirement: Rewards from the Sheet

The page SHALL show the friend's reward and the referrer's reward exactly as set in the Sheet, and SHALL hide the reward amounts when they are not set.

#### Scenario: Rewards set

- **WHEN** the referral rewards are "₦2,000 off your next order" and "₦1,000 off their first order"
- **THEN** both are shown, labelled "You get" and "Your friend gets"

#### Scenario: Rewards not set

- **WHEN** the reward settings are blank
- **THEN** no amounts are shown and visitors are asked to ask about the current reward

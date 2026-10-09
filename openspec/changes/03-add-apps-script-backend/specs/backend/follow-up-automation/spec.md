## Purpose

Turns the Sheet into a daily follow-up routine: one morning email listing everyone to contact, each with a ready-written WhatsApp message, plus automatic reorder dates, referral rewards and inactivity flags.

## ADDED Requirements

### Requirement: Daily to-do email

Every day at 07:00 WAT the distributor SHALL receive one email listing new leads, abandoned website orders, unpaid orders, day-3 and day-14 check-ins, reorders due, 60-day win-backs, referral rewards due and duplicate referral codes, each with a one-tap WhatsApp link containing the message text.

#### Scenario: Reorder due

- **WHEN** a delivered order's reorder date is today
- **THEN** the email lists the customer with a WhatsApp link pre-filled with the reorder reminder naming the product

#### Scenario: Nothing due

- **WHEN** no follow-ups are due
- **THEN** the email is still sent and says nothing is due today

### Requirement: Reorder dates from pack duration

When an order is marked Delivered, the system SHALL schedule a day-3 check-in, a day-14 check-in and a reorder reminder 5 days before the estimated finish (delivery date + pack days × quantity).

#### Scenario: One 30-day pack

- **WHEN** an order with one 30-day pack is marked Delivered on 1 October
- **THEN** the day-3 check-in is due 4 October, the day-14 check-in 15 October, and the reorder reminder 26 October

### Requirement: Referral rewards become due on the friend's first paid order

When a referred customer's first order is marked Paid, the referrer's reward SHALL become Due and appear in the next to-do email.

#### Scenario: Friend pays

- **WHEN** an order carrying referral code AMAKA-4821 from a first-time customer is marked Paid
- **THEN** the Referrals row for that friend shows reward_status = Due

### Requirement: Inactivity flag

Customers with no order for 60 days SHALL be listed for a win-back message and marked Inactive.

#### Scenario: 60 days quiet

- **WHEN** a customer's last order was 60 days ago
- **THEN** they appear in the win-back list and their status becomes Inactive

## Purpose

Records contact, business-interest, referral-code and seminar-interest submissions from the website in the client's Sheet, with consent, so every lead gets followed up.

## ADDED Requirements

### Requirement: Consent required

Contact, business-interest and seminar-interest submissions SHALL be rejected unless consent is true, and the consent time SHALL be stored with the lead.

#### Scenario: Consent missing

- **WHEN** a contact submission arrives with consent = false
- **THEN** the response is `{ok:false, code:"invalid_payload"}` and nothing is recorded

### Requirement: Leads deduplicated by phone

A submission from a phone number already in Leads & Customers SHALL update that row (last contact, interest, notes appended) instead of creating a new one.

#### Scenario: Existing customer uses the contact form

- **WHEN** a customer already in the Sheet submits the contact form
- **THEN** their existing row is updated and no duplicate row is created

### Requirement: Business interest flagged

Business-interest submissions SHALL set business_interest = Yes on the lead.

#### Scenario: Distributor enquiry

- **WHEN** a business-interest form is submitted
- **THEN** the lead shows business_interest = Yes and source "business_form"

### Requirement: Referral code registry

A referral-code submission SHALL be stored once per code and phone, and a code already registered to a different phone SHALL be flagged as a duplicate.

#### Scenario: Same person again

- **WHEN** the same person generates their code a second time
- **THEN** no new Referrals row is created

#### Scenario: Collision

- **WHEN** a code arrives that belongs to a different phone number
- **THEN** the new row is stored with duplicate_flag = Yes and it appears in the next to-do email

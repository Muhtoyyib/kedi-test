## Why

The site is static, but it still has to (a) read the client's product data at build time, (b) record every order, lead and referral code the moment it happens, and (c) remind the distributor every morning who to follow up. The plan puts all of this in the client's own Google Sheet with Apps Script: free, client-owned, and nothing to maintain.

## What Changes

- Add `apps-script/`, a TypeScript Apps Script project managed with `clasp`, deployed as a web app from the **client's** Google account.
- **Workbook template:** a script `setupWorkbook()` creates all tabs with exact headers, data validation (Yes/No, status lists), protected formula columns and a `Dashboard` (see `docs/content-model.md` §1 and §4).
- **Endpoints** (`docs/architecture.md` §7):
  - `GET ?action=catalog`: validated JSON of Products, Categories, Product FAQs, Settings, Delivery, Seminar Schedule, **Highlights, Videos, Stories and Articles** (token-protected). Each article's Google Doc is converted to typed blocks.
  - `GET ?action=image`: base64 of a Drive image by ID (token-protected).
  - `GET ?action=doc_image`: base64 of the n-th inline image in an article's Google Doc (token-protected).
  - `POST` with `type`: `order`, `contact`, `business_interest`, `referral_code`, `seminar_interest`.
  - `POST ?action=publish_result`: deploy outcome from GitHub Actions (token-protected).
- **Order intake:** dedupe by order ID, recompute subtotal from Products, flag price mismatches, upsert the customer, status `Started on website`.
- **Automations:** daily 07:00 WAT to-do email with one-tap WhatsApp links; status-change triggers that fill `Reorder Queue` and `Referrals` reward status; Inactive flag after 60 days.
- **Drive folders:** `setupWorkbook()` also creates "Product photos", "Seminar photos", "Story photos" and "Website Articles" folders, plus an **Article template** Doc that shows the client how to format an article.
- **Sheet menu "KEDI Website":** `Publish website`, `Check content for errors`, `New article from template`, `Open last publish run`, `Send today's to-do email now`.

## Capabilities

### New Capabilities

- `backend/catalog-endpoint`: read-only catalog and image access for builds.
- `backend/client-content`: highlights, videos, customer stories and Google Doc articles managed by the client in the Sheet.
- `backend/order-intake`: recording website orders reliably.
- `backend/form-intake`: recording contact, business-interest, referral-code and seminar-interest submissions.
- `backend/follow-up-automation`: the daily to-do email, reorder queue, referral rewards and inactivity flags.
- `backend/publish`: publishing the website from the Sheet and showing the result.

## Impact

- New folder `apps-script/` (not bundled into the site).
- Client inputs: the Google account that will own the Sheet; the distributor's email; the WhatsApp number.
- Secrets: `CATALOG_READ_TOKEN`, `GITHUB_TOKEN` (fine-grained, repo-scoped, Actions read/write) in Script Properties.
- Unlocks change 04 (live catalog), 05 (order logging), 06 (referral logging) and the forms in 16, 19, 20.

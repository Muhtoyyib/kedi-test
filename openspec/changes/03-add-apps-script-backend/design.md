## Context

Apps Script runs as the deploying user ("Execute as: Me"). Web app POSTs from browsers must be CORS "simple requests" (`text/plain`), because Apps Script cannot answer preflight. JSON from `ContentService` is returned through a redirect to `script.googleusercontent.com`, and simple requests can read it. Quotas for consumer accounts (`docs/../KEDI_Running_Costs_and_Payments.md` §4): 100 email recipients/day, 90 min/day trigger runtime, 20,000 URL fetches/day. The design stays far below these.

## Goals / Non-Goals

**Goals**

- Writes are atomic (`LockService.getScriptLock()`, 10 s wait).
- Every input is validated server-side; the browser is never trusted for prices.
- The client can run the whole thing from the Sheet menu without code.

**Non-Goals**

- Sending WhatsApp messages automatically (the plan uses the free app; the to-do email gives one-tap links instead).
- A CRM UI beyond the Sheet.

## Decisions

### 1. Project layout

```
apps-script/
├── .clasp.json            # scriptId (client's project), rootDir: dist
├── appsscript.json        # timeZone "Africa/Lagos", webapp {executeAs: USER_DEPLOYING, access: ANYONE_ANONYMOUS}, oauthScopes
├── package.json           # devDeps: @google/clasp, @types/google-apps-script, esbuild, vitest
├── src/
│   ├── main.ts            # doGet, doPost, onOpen (menu), installTriggers
│   ├── router.ts          # dispatch by action/type
│   ├── sheets.ts          # header-indexed read/append/upsert helpers
│   ├── schema.ts          # tab names, headers, validation lists (single source)
│   ├── catalog.ts         # build CatalogPayload
│   ├── content.ts         # Highlights, Videos, Stories rows + parseVideoUrl
│   ├── docs.ts            # Google Doc → ArticleBlock[] conversion, doc_image
│   ├── images.ts          # Drive blob → base64
│   ├── orders.ts          # order intake
│   ├── forms.ts           # contact / business / referral / seminar intake
│   ├── referrals.ts       # code registry, duplicate flag, reward status
│   ├── followups.ts       # daily to-do email, reorder queue, inactivity
│   ├── publish.ts         # GitHub dispatch + publish log
│   ├── phone.ts           # same normalisation as the site (copy + same tests)
│   ├── validate.ts        # payload parsers
│   └── setup.ts           # setupWorkbook()
└── test/                  # vitest with Sheet/Lock/Cache fakes
```

Build with esbuild to a single IIFE-free file (Apps Script's global scope), then `clasp push`. The pure modules (`validate`, `phone`, order maths, message text) are unit tested in Node.

### 2. Order intake algorithm

```
parse body → reject if >10KB or hp non-empty (return ok:true silently for hp)
validate OrderPayload (types, lengths, 1..20 lines, qty 1..20, phone normalises)
rate-limit: CacheService key "rl:"+phone, max 5 per 10 min; global "rl:all" 60/min
lock
  if Orders has order_id → return {ok:true, id, code:"duplicate"}
  computed = Σ qty × Products.price_ngn (null price → excluded, flagged "has_ask_price")
  mismatch = computed ≠ payload.subtotal (when no ask-price lines)
  append Orders row: status "Started on website", items_text "Product A × 2; Product B × 1"
  upsert Leads & Customers by phone: name/area if blank, source "website_order" if new,
        status: keep if already Customer/Repeat/Referrer else "Contacted",
        followup_consent = payload.followupConsent (only ever set true→ stays true until STOP)
  if referralCode: append to Referrals as pending use (referred_phone, first_order_id) if code exists
unlock → {ok:true, id}
```

### 3. Status transitions (installable `onEdit` trigger on `Orders.status`)

| New status         | Effect                                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Awaiting Payment` | none (set by the distributor when the WhatsApp message arrives)                                                                                                                                                                                                    |
| `Paid`             | Customer `order_count` += 1, `last_order_at` = today; status → `Customer` (first) or `Repeat Customer` (2+). If the order has a referral code and this is the customer's first paid order → Referrals `reward_status = Due` and the referrer's status → `Referrer` |
| `Delivered`        | `delivered_at` = today; one `Reorder Queue` row per line: `due_date = delivered_at + pack_days × qty − 5 days`, `day3_due = delivered_at + 3`, `day14_due = delivered_at + 14`                                                                                     |
| `Cancelled`        | Removes pending Reorder Queue rows for that order                                                                                                                                                                                                                  |

### 4. Daily to-do email (time trigger 07:00 WAT)

Subject: `[Brand Name] — today's follow-ups ({count})`. HTML sections, each a table of rows with a one-tap button `https://wa.me/{phone}?text={encoded message}`:

1. New leads not contacted (status `New Lead`, added before today)
2. Website orders still `Started on website` after 24 h → message: "Hello {first name}, this is [Brand Name]. I saw your order {order_id} on our website — would you like to go ahead? I'm happy to answer any questions."
3. Unpaid orders (`Awaiting Payment` > 24 h) → payment reminder text
4. Day-3 check-ins due → `/day3` text
5. Day-14 check-ins due → `/day14` text
6. Reorders due → `/reorder` text with the product name
7. 60-day win-backs (`last_order_at` ≥ 60 days, not already Inactive) → `/winback` text; sets status `Inactive`
8. Referral rewards due → message to the referrer
9. Duplicate referral codes to resolve

Rows the distributor has handled are marked by ticking `sent` checkboxes in the queue tabs (the email shows only unticked). Empty sections are omitted; if all are empty, the email says "Nothing due today. 🎉" and is still sent (so the distributor knows it ran).

### 5. Publish

`Publish website` menu → confirm dialog "Publish your latest changes to the website? It takes about 3 minutes." → run `Check content for errors` (same validation as the catalog endpoint) → if errors, show them in a dialog and stop → `UrlFetchApp.fetch("https://api.github.com/repos/{repo}/actions/workflows/deploy.yml/dispatches", {method:"post", headers:{Authorization:"Bearer "+token, Accept:"application/vnd.github+json"}, payload: JSON.stringify({ref:"main", inputs:{reason:"sheet-publish by "+Session.getActiveUser().getEmail()}})})` → append Publish Log row "Requested" → toast "Publishing… your site updates in about 3 minutes." The workflow later POSTs `publish_result`, which updates the row to "Live ✅" or "Failed ❌" with the run URL.

### 6. Content validation (shared by the catalog endpoint and the "Check content for errors" menu)

Errors (block publish): missing required field; duplicate `product_id` or `slug`; `category` not in Categories; `price_ngn` not a positive integer; `pack_days` not 1–365; no `image_ids`; invalid seminar date/time; `luma_url` not https. Warnings (allowed): `short_benefit` > 90 chars (truncated), no `nafdac_no`, product not featured anywhere. Banned-word check on `short_benefit`/`description` (cure, treat, heal, prevent, disease names list) → **warning** shown to the client ("Check this wording is KEDI-approved"), not an error, because approved KEDI text is the authority.

Client-written content (Highlights, Videos, Stories, Articles) is checked by the rules in §7. There, banned health-claim words are **errors**, because the client writes this text themselves rather than copying KEDI-approved wording.

The menu shows a dialog grouped by tab: "3 problems must be fixed before publishing" (errors, with row number, ID and a plain-English fix), then "2 things to check" (warnings).

### 7. Client content: Highlights, Videos, Stories, Articles

Source columns: `docs/content-model.md` §1. Output types: §2 (`Highlight`, `Video`, `Story`, `Article`). Image fields are returned as raw Drive IDs; the build pipeline (change 04) downloads and converts them.

**Videos and video links** (`content.ts` → `parseVideoUrl(url)`): accept `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/shorts/ID`, `youtube.com/live/ID` and `tiktok.com/@user/video/ID`. Return `{provider, id, url}`. Anything else is an error: "Videos row 4: this link isn't a YouTube or TikTok video link".

**Stories rules**

- `name` must match `^[A-Z][a-zA-Z'-]+ [A-Z]\.$`. Otherwise error "Use first name and initial only, e.g. Ngozi A.".
- No `consent_date` → the story is **left out** (not an error) and listed as a warning: "Story ST-004 is not published because there's no consent date".
- `photo_id` set but `consent_photo` ≠ Yes → the photo is dropped (warning). The same applies to video with `consent_video`.
- `featured = Yes` on more than 3 rows → warning; the newest 3 are used.

**Highlights rules:** a comment without `comment_consent_date` is dropped (warning). At least one photo is required.

**Articles: Google Doc conversion** (`docs.ts` → `convertDoc(docId)`)

1. Open with `DocumentApp.openById(docId)`. If it can't be opened → error "Articles row 3: the Doc can't be opened. Share it with [owner account]".
2. Walk `body.getNumChildren()` in order:
   - `PARAGRAPH` with heading `HEADING1` or `TITLE` → the title, if the `title` column is blank (otherwise ignored).
   - `HEADING2` → `{type:"h2", id: slug(text), text}`. If the text is exactly "When to see a doctor" (case-insensitive), open a `doctor-callout` that collects every block until the next `HEADING2`.
   - `HEADING3` → `h3`. `HEADING4–6` → `h3`.
   - `NORMAL_TEXT` paragraph → `p` with inlines built from text runs (`getTextAttributeIndices`): bold, italic, link URL. Empty paragraphs are skipped.
   - A paragraph whose whole text is a YouTube/TikTok URL → `{type:"video", video}`.
   - `LIST_ITEM` → grouped into `ul`/`ol` by `getGlyphType()` (numbered glyphs → `ol`). Nested levels are flattened to one level.
   - `INLINE_IMAGE` (inside a paragraph) → `{type:"image", ref:{doc: docId, n}, alt: image.getAltDescription() || image.getAltTitle() || ""}`. Missing alt → warning "Add alt text to image 2 in ART-003".
   - `TABLE`, horizontal rules, page breaks, footnotes, equations → ignored, with a warning "Tables aren't shown on the website".
3. Links: only `https://`, `http://`, `mailto:` and site-relative `/…` are kept; other links become plain text.
4. `readingMinutes = max(1, ceil(words / 200))`.
5. Compliance: run the banned-word check (same list as products, `docs/copy-and-compliance.md` §2) on every text block **outside** a `doctor-callout`. A hit is an **error**: "ART-003, paragraph 5: 'cures' — health claims aren't allowed. Rephrase, or move it under a 'When to see a doctor' heading if it's about seeing a doctor."
6. Cache the converted article in `CacheService` keyed by `docId + doc.getLastUpdated()` for 6 hours, so repeated catalog calls stay fast.

`?action=doc_image&doc=&n=` returns the n-th `INLINE_IMAGE` blob of that Doc (same 8 MB guard).

**Article template Doc** (created by `setupWorkbook()`): it shows the title, an intro paragraph, Heading 2 sections, a list, an image with alt text, a YouTube link on its own line, and a "When to see a doctor" section, each with a short note in grey explaining what it becomes. `New article from template` copies it into "Website Articles", names it "Untitled article", adds an `Articles` row with `ready = No` and the Doc link, and opens it.

## Risks / Trade-offs

- [Web app URL is public] → Validation, honeypot, rate limits, size limits; it can only append rows, never read customer data. The catalog endpoint needs the token.
- [Apps Script cold start ~1–3 s] → Orders use `sendBeacon` (no wait); forms show a spinner. Acceptable.
- [The client edits header names] → `setupWorkbook()` protects header rows (warning-only protection); `Check content for errors` reports unknown or missing headers.
- [Doc formatting the converter doesn't support] → It is ignored with a warning, never published raw. The template Doc shows what is supported.
- [Many long articles slow the catalog call] → Per-Doc cache keyed by last-updated time; only changed Docs are re-converted.
- [PAT expiry] → Fine-grained token with 1-year expiry; the Publish Log shows a clear "GitHub token expired — contact [developer]" error on 401.

## Migration Plan

1. Developer creates the Apps Script project in the client's Google account (shared access during build), runs `setupWorkbook()`, fills Script Properties, deploys the web app, and records the URL in GitHub secrets and `VITE_APPS_SCRIPT_URL`.
2. Each new deployment uses "Manage deployments → Edit → New version", so the URL never changes.

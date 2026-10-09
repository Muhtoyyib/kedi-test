# Content Model

Three kinds of content:

1. **Sheet-managed** (client edits, site rebuilds on Publish): products, categories, product FAQs, settings, delivery fees, seminar schedule, **seminar highlights, videos, customer stories and articles** (article text is written in Google Docs and listed in the Sheet).
2. **Repo-managed** (developer edits, rarely changes): general FAQs, About/host text, business-opportunity text, legal pages, site config.

The rule: **anything the client should update without a developer lives in the Sheet.** The client never needs Git, code or a developer to publish a seminar, a story, a video or an article. 3. **Runtime records** (Apps Script writes): orders, leads, referrals, reorder queue, dashboard, publish log.

## 1. Google Sheet: client-edited tabs

Column headers are exact (lower snake case in row 1). The Apps Script reads by header name, so column order may change but names may not. Rows with `active = No` (where present) are ignored.

### `Products`

| Column            | Type                                       | Required | Rules / example                                                                                                             |
| ----------------- | ------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `product_id`      | text                                       | yes      | `KD-P001`. Unique. Never reused.                                                                                            |
| `active`          | Yes/No                                     | yes      | `No` hides the product everywhere                                                                                           |
| `name`            | text                                       | yes      | Exactly as on the pack, e.g. `Product A`                                                                                    |
| `slug`            | text                                       | no       | URL part; blank → generated from `name` (lowercase, hyphens). Must be unique. Changing it breaks old links, so set it once. |
| `category`        | text                                       | yes      | Must match a `Categories.slug`                                                                                              |
| `price_ngn`       | number                                     | no       | `18500`. Blank → "Ask for price"                                                                                            |
| `pack_size`       | text                                       | yes      | `60 capsules`, `100 ml`                                                                                                     |
| `pack_days`       | number                                     | yes      | How many days one pack lasts at the approved dose. Drives reorder reminders and the "lasts about" line                      |
| `in_stock`        | Yes/No                                     | yes      | `No` → "Out of stock" badge; Add to cart becomes "Ask on WhatsApp"                                                          |
| `featured`        | Yes/No                                     | no       | Shown on home page (max 8; by `sort_order`)                                                                                 |
| `sort_order`      | number                                     | no       | Lower first; blank = 999                                                                                                    |
| `short_benefit`   | text ≤ 90 chars                            | yes      | **Approved KEDI wording only.** Shown on cards                                                                              |
| `description`     | text (paragraphs separated by blank lines) | yes      | Approved wording                                                                                                            |
| `ingredients`     | text (one per line)                        | no       |                                                                                                                             |
| `how_to_use`      | text (one step per line)                   | yes      | Manufacturer's approved usage only                                                                                          |
| `nafdac_no`       | text                                       | no       | e.g. `A7-1234`. Blank → line hidden                                                                                         |
| `image_ids`       | text                                       | yes      | Google Drive file IDs, comma-separated; first is the main image. Max 6                                                      |
| `related_ids`     | text                                       | no       | Comma-separated `product_id`s; blank → same category                                                                        |
| `seo_title`       | text ≤ 60                                  | no       | Blank → `{name} — {pack_size} \| [Brand Name]`                                                                              |
| `seo_description` | text ≤ 155                                 | no       | Blank → `short_benefit` + " Order on WhatsApp in [City]."                                                                   |

### `Categories`

| Column        | Type       | Required | Example                                  |
| ------------- | ---------- | -------- | ---------------------------------------- |
| `slug`        | text       | yes      | `digestive-health`                       |
| `name`        | text       | yes      | `Digestive Health`                       |
| `description` | text ≤ 200 | yes      | Plain wellness wording, no disease names |
| `sort_order`  | number     | no       |                                          |
| `image_id`    | text       | no       | Drive file ID for the category tile      |
| `active`      | Yes/No     | yes      |                                          |

### `Product FAQs`

| Column       | Type   | Example                    |
| ------------ | ------ | -------------------------- |
| `product_id` | text   | `KD-P001`                  |
| `question`   | text   | `Can I take it with food?` |
| `answer`     | text   | Approved wording           |
| `sort_order` | number |                            |

### `Settings` (key / value)

| key                           | Example value                                                         | Used on                                                      |
| ----------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `bank_name`                   | `[Bank Name]`                                                         | FAQ (how to pay), Contact payment notice, `/pay` quick reply |
| `bank_account_name`           | `[Business Name] Ltd`                                                 | same                                                         |
| `bank_account_number`         | `0123456789`                                                          | same                                                         |
| `opening_hours`               | `Mon–Sat, 9:00 AM – 6:00 PM`                                          | Footer, Contact                                              |
| `pickup_address`              | `[Address]`                                                           | Contact, Delivery page, Footer                               |
| `delivery_note`               | `Orders confirmed before 2 PM are dispatched the same day in [City].` | Cart drawer, Delivery page                                   |
| `announcement_text`           | optional, ≤ 90 chars                                                  | Announcement bar (blank = hidden)                            |
| `announcement_link`           | optional path                                                         | Announcement bar link                                        |
| `seminar_offer_text`          | `Seminar-only bundle: 10% off for 48 hours after the seminar.`        | Seminars page                                                |
| `referral_reward_text`        | `₦2,000 off your next order`                                          | Refer page, home                                             |
| `referral_friend_reward_text` | `₦1,000 off their first order`                                        | Refer page                                                   |
| `loyalty_text`                | `Every 5th order earns a free gift.`                                  | Refer page, FAQ                                              |
| `free_delivery_threshold_ngn` | optional number                                                       | Cart drawer hint                                             |

### `Delivery`

| Column          | Type                              | Example                                          |
| --------------- | --------------------------------- | ------------------------------------------------ |
| `area`          | text                              | `Ikeja`, `Lekki`, `Abuja (interstate)`, `Pickup` |
| `zone`          | `local` / `interstate` / `pickup` |                                                  |
| `fee_ngn`       | number                            | `2500`; `0` for pickup                           |
| `timeline_text` | text                              | `Same day if confirmed before 2 PM`              |
| `sort_order`    | number                            |                                                  |
| `active`        | Yes/No                            |                                                  |

The cart's "Delivery area" is a select built from this tab plus "Other (we'll confirm)".

### `Seminar Schedule`

| Column                    | Type                               | Example                                               |
| ------------------------- | ---------------------------------- | ----------------------------------------------------- |
| `seminar_id`              | text                               | `SEM-2026-10-12`                                      |
| `date`                    | `YYYY-MM-DD`                       | `2026-10-12`                                          |
| `start_time` / `end_time` | `HH:mm` (WAT, 24h)                 | `16:00` / `17:30`                                     |
| `topic`                   | text                               | `Better digestion, better days`                       |
| `summary`                 | text ≤ 200                         |                                                       |
| `learn_points`            | text, `\|`-separated, 3–4 items    | `Daily habits…\|Foods that…\|How to read…`            |
| `audience`                | text                               | `Anyone who wants to feel lighter and more energetic` |
| `format`                  | `physical` / `online`              |                                                       |
| `venue`                   | text                               | Address (physical) or `YouTube Live` (online)         |
| `luma_url`                | URL                                | `https://lu.ma/abc123`                                |
| `luma_event_id`           | text                               | `evt-XXXXXXXX` (for the embed)                        |
| `status`                  | `scheduled` / `cancelled` / `done` |                                                       |
| `recording_url`           | URL                                | YouTube link after the event                          |

The **next seminar** = first row with `status = scheduled` whose start is in the future (Africa/Lagos). The site recomputes this in the browser too, so a banner never shows a seminar that has already started even if the nightly rebuild has not run yet.

### `Highlights` (past seminar highlights)

| Column                 | Type         | Required         | Example / rule                                                                                                                |
| ---------------------- | ------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `highlight_id`         | text         | yes              | `HL-2026-10-12`. Unique                                                                                                       |
| `active`               | Yes/No       | yes              |                                                                                                                               |
| `date`                 | `YYYY-MM-DD` | yes              | Seminar date                                                                                                                  |
| `topic`                | text         | yes              | `Better digestion, better days`                                                                                               |
| `seminar_id`           | text         | no               | Links to `Seminar Schedule.seminar_id` (topic/date are taken from there when blank)                                           |
| `photo_ids`            | text         | yes              | Drive file IDs, comma-separated, max 8. Photos of groups/rooms; people identifiable up close need the same consent as stories |
| `photo_alts`           | text         | no               | `\|`-separated alt texts in the same order; blank → "Seminar on {topic}, photo {n}"                                           |
| `video_url`            | URL          | no               | YouTube or TikTok link to a short clip                                                                                        |
| `comment_text`         | text ≤ 220   | no               | An attendee's comment                                                                                                         |
| `comment_name`         | text         | no               | First name + initial, e.g. `Bola T.`                                                                                          |
| `comment_consent_date` | `YYYY-MM-DD` | when comment set | Comment is dropped (warning) without it                                                                                       |

### `Videos` (Wellness Hub videos)

| Column          | Type         | Required | Example / rule                                                                                            |
| --------------- | ------------ | -------- | --------------------------------------------------------------------------------------------------------- |
| `video_id`      | text         | yes      | `VID-001`. Unique                                                                                         |
| `active`        | Yes/No       | yes      |                                                                                                           |
| `url`           | URL          | yes      | Any YouTube (`youtube.com/watch?v=`, `youtu.be/`, `/shorts/`) or TikTok (`tiktok.com/@user/video/…`) link |
| `title`         | text ≤ 80    | yes      | `3 easy breakfast swaps`                                                                                  |
| `topic`         | text         | yes      | One of the topic keys (see Articles)                                                                      |
| `duration_text` | text         | no       | `1 min`                                                                                                   |
| `date`          | `YYYY-MM-DD` | yes      | Newest first                                                                                              |

### `Stories` (customer stories)

| Column            | Type                       | Required | Example / rule                                                     |
| ----------------- | -------------------------- | -------- | ------------------------------------------------------------------ |
| `story_id`        | text                       | yes      | `ST-001`. Unique; becomes the page anchor (`#st-001`)              |
| `active`          | Yes/No                     | yes      |                                                                    |
| `name`            | text                       | yes      | First name + initial only: `Ngozi A.` (validated)                  |
| `area`            | text                       | yes      | `Ikeja`                                                            |
| `quote`           | text ≤ 220                 | yes      | Their words about the service                                      |
| `full_story`      | text                       | no       | Longer version (paragraphs separated by blank lines)               |
| `photo_id`        | text                       | no       | Drive file ID                                                      |
| `video_url`       | URL                        | no       | YouTube or TikTok link (makes it a video story)                    |
| `consent_date`    | `YYYY-MM-DD`               | **yes**  | Date the customer agreed. **No date → the story is not published** |
| `consent_channel` | WhatsApp / Written / Email | yes      |                                                                    |
| `consent_photo`   | Yes/No                     | yes      | Photo shown only when Yes                                          |
| `consent_video`   | Yes/No                     | yes      | Video shown only when Yes                                          |
| `featured`        | Yes/No                     | no       | Max 3 shown on the home page                                       |
| `date`            | `YYYY-MM-DD`               | yes      | Newest first                                                       |

### `Articles` (Wellness Hub articles)

The article **text** is written in a Google Doc inside the shared Drive folder **Website Articles**. This tab lists each article and its settings.

| Column             | Type         | Required | Example / rule                                                                                            |
| ------------------ | ------------ | -------- | --------------------------------------------------------------------------------------------------------- |
| `article_id`       | text         | yes      | `ART-001`. Unique                                                                                         |
| `ready`            | Yes/No       | yes      | Only `Yes` rows are published (this replaces "draft")                                                     |
| `doc_url`          | URL          | yes      | Link to the Google Doc                                                                                    |
| `title`            | text ≤ 70    | no       | Blank → the Doc's first Heading 1 / title                                                                 |
| `slug`             | text         | no       | Blank → from title. Set once; changing it breaks shared links                                             |
| `topic`            | text         | yes      | `digestion`, `energy`, `immunity`, `heart-and-circulation`, `women`, `men`, `weight`, `everyday-wellness` |
| `description`      | text ≤ 155   | yes      | Shown on cards and in Google results                                                                      |
| `cover_image_id`   | text         | yes      | Drive file ID, 16:9 landscape, ≥ 1200px wide                                                              |
| `cover_alt`        | text         | yes      | Plain description of the cover photo                                                                      |
| `related_category` | text         | no       | A `Categories.slug`                                                                                       |
| `date`             | `YYYY-MM-DD` | yes      | Publish date shown on the article                                                                         |

**How to write the Google Doc** (also in the client's playbook):

| In the Doc                                                         | On the website                                                                           |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Normal text                                                        | Paragraph                                                                                |
| Heading 2 / Heading 3                                              | Section heading / sub-heading                                                            |
| Bullet or numbered list                                            | List                                                                                     |
| **Bold**, _italic_, links                                          | Kept                                                                                     |
| A picture (inline)                                                 | Image (the picture's Alt text is used; set it with right-click → Alt text)               |
| A YouTube or TikTok link alone on its own line                     | Embedded video                                                                           |
| A Heading 2 that reads exactly **When to see a doctor**            | The highlighted "When to see a doctor" box (everything under it, until the next heading) |
| Anything else (tables, colours, font sizes, comments, suggestions) | Ignored                                                                                  |

Only the Doc's **current text** is used: suggestions and comments are ignored. The Doc must be shared with (or owned by) the Google account that runs the Apps Script.

## 2. Generated catalog (`src/generated/catalog.json`)

Written by `scripts/fetch-catalog.ts`. TypeScript types live in `src/lib/catalog/types.ts`. Access only through `src/lib/catalog/*.ts` helpers (`getProducts()`, `getProductBySlug()`, `getCategory()`, `getNextSeminar(now)`, `getSettings()`, `getDeliveryAreas()`).

```ts
interface Catalog {
  source: "live" | "fixture";
  generatedAt: string; // ISO
  products: Product[];
  categories: Category[];
  settings: Settings;
  delivery: DeliveryArea[];
  seminars: Seminar[];
  highlights: Highlight[];
  videos: Video[];
  stories: Story[];
  articles: Article[];
}

interface Product {
  id: string; // KD-P001
  slug: string;
  name: string;
  categorySlug: string;
  priceNgn: number | null; // null → Ask for price
  packSize: string;
  packDays: number;
  inStock: boolean;
  featured: boolean;
  sortOrder: number;
  shortBenefit: string;
  description: string[]; // paragraphs
  ingredients: string[];
  howToUse: string[];
  nafdacNo: string | null;
  images: GeneratedImage[]; // first = main
  relatedIds: string[];
  faqs: {question: string; answer: string}[];
  seo: {title: string; description: string};
}

interface GeneratedImage {
  key: string; // p/KD-P001/0
  alt: string; // "{name} — {pack_size}" (+ " (image n)")
  width: number; // intrinsic of largest variant
  height: number;
  variants: {width: number; avif: string; webp: string}[];
}

interface Category {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  image: GeneratedImage | null;
}
interface DeliveryArea {
  area: string;
  zone: "local" | "interstate" | "pickup";
  feeNgn: number;
  timelineText: string;
}
interface Seminar {
  id: string;
  startsAt: string;
  endsAt: string; // ISO with +01:00
  topic: string;
  summary: string;
  learnPoints: string[];
  audience: string;
  format: "physical" | "online";
  venue: string;
  lumaUrl: string;
  lumaEventId: string;
  status: "scheduled" | "cancelled" | "done";
  recordingUrl: string | null;
}
interface VideoRef {
  provider: "youtube" | "tiktok";
  id: string;
  url: string;
  poster: GeneratedImage;
} // poster: YouTube thumbnail or TikTok oEmbed thumbnail, downloaded at build
interface Highlight {
  id: string;
  date: string;
  topic: string;
  seminarId: string | null;
  photos: GeneratedImage[];
  video: VideoRef | null;
  comment: {text: string; name: string} | null; // null when no consent date
}
interface Video {
  id: string;
  title: string;
  topic: Topic;
  durationText: string | null;
  date: string;
  video: VideoRef;
}
interface Story {
  id: string;
  slug: string;
  name: string;
  area: string;
  quote: string;
  fullStory: string[];
  photo: GeneratedImage | null; // null unless consent_photo = Yes
  video: VideoRef | null; // null unless consent_video = Yes
  kind: "written" | "video"; // "video" when video is non-null
  consent: {date: string; channel: "whatsapp" | "written" | "email"};
  featured: boolean;
  date: string;
}
type Topic = "digestion" | "energy" | "immunity" | "heart-and-circulation" | "women" | "men" | "weight" | "everyday-wellness";
interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  topic: Topic;
  date: string;
  cover: GeneratedImage;
  coverAlt: string;
  relatedCategory: string | null;
  readingMinutes: number; // words / 200, rounded up, min 1
  body: ArticleBlock[];
  toc: {id: string; text: string}[]; // from h2 blocks
}
type Inline = {text: string; bold?: true; italic?: true; href?: string};
type ArticleBlock =
  | {type: "h2" | "h3"; id: string; text: string}
  | {type: "p"; inlines: Inline[]}
  | {type: "ul" | "ol"; items: Inline[][]}
  | {type: "image"; image: GeneratedImage; alt: string}
  | {type: "video"; video: VideoRef}
  | {type: "doctor-callout"; blocks: ArticleBlock[]}; // the "When to see a doctor" section
interface Settings {
  bank: {name: string; accountName: string; accountNumber: string} | null;
  openingHours: string;
  pickupAddress: string;
  deliveryNote: string;
  announcement: {text: string; href: string | null} | null;
  seminarOfferText: string | null;
  referralRewardText: string;
  referralFriendRewardText: string;
  loyaltyText: string | null;
  freeDeliveryThresholdNgn: number | null;
}
```

## 3. Repo-managed content (developer edits)

### `src/lib/site-config.ts`

```ts
export const siteConfig = {
  name: "[Brand Name]",
  legalName: "[Registered Business Name]",
  tagline: "Your trusted KEDI wellness partner in [City]",
  distributorName: "[Distributor Name]",
  city: "[City]",
  state: "[State]",
  serviceAreas: ["[Area 1]", "[Area 2]", "[Area 3]"],
  url: import.meta.env.VITE_SITE_URL,
  whatsapp: {number: "[2348000000000]", display: "[+234 800 000 0000]"},
  phone: {number: "[+2348000000000]", display: "[0800 000 0000]"},
  email: "hello@[domain]",
  address: {street: "[Street]", city: "[City]", state: "[State]", mapsQuery: "[Business Name, Street, City]"},
  socials: {instagram: "[url]", facebook: "[url]", tiktok: "[url]", youtube: "[url]", whatsappChannel: "[url]"},
  luma: {calendarUrl: "[https://lu.ma/...]", calendarId: "[cal-...]"},
  yearsOfExperience: "[N]",
  kedi: {statement: "We are an independent distributor of KEDI Healthcare products."},
} as const;
```

### `content/faq.ts`

```ts
interface FaqItem {
  id: string; // "how-to-order"
  group: "ordering" | "payment" | "delivery" | "returns" | "products" | "seminars" | "referrals" | "business";
  question: string;
  answer: string; // short markdown; may use {settings.*} tokens resolved at build
  showOn: ("faq" | "seminars" | "business" | "contact" | "refer")[];
}
```

### `content/about.ts`, `content/business.ts`

Typed modules for the About/host text and the business-opportunity copy (shapes in changes 17 and 16). These change rarely and need careful wording, so the developer edits them.

### `content/legal/*.mdx` (fumadocs-mdx collection `legal`)

`privacy.mdx`, `terms.mdx`, `health-disclaimer.mdx`, `delivery-and-returns.mdx`. Frontmatter: `title`, `description`, `updated` (date). They may include `<DeliveryTable />` and `<BankDetails />` components that read the catalog.

## 4. Runtime tabs (written by Apps Script)

Specified in change `03-add-apps-script-backend`. Summary:

| Tab                 | Key columns                                                                                                                                                                                                                                                                                                                 |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Orders`            | order_id, created_at, customer_name, phone, area, items_json, items_text, subtotal_ngn, computed_subtotal_ngn, price_mismatch, referral_code, followup_consent, status (Started on website / Awaiting Payment / Paid / Dispatched / Delivered / Cancelled), delivered_at, utm_source, utm_medium, utm_campaign, page, notes |
| `Leads & Customers` | phone (key), name, area, source, interest, status (New Lead → … → Referrer, Inactive), business_interest, consent, consent_at, date_added, last_contact, last_order_at, order_count, notes                                                                                                                                  |
| `Referrals`         | code, referrer_name, referrer_phone, created_at, referred_phone, first_order_id, reward_status (Pending / Due / Sent), duplicate_flag                                                                                                                                                                                       |
| `Reorder Queue`     | order_id, phone, product_id, delivered_at, pack_days, qty, due_date (formula), day3_due, day14_due, sent flags                                                                                                                                                                                                              |
| `Dashboard`         | formulas only                                                                                                                                                                                                                                                                                                               |
| `Publish Log`       | requested_at, requested_by, run_url, status, finished_at, commit, message                                                                                                                                                                                                                                                   |

# Client Inputs (Placeholder Registry)

Every `[Placeholder]` in the site maps to a row here. When the client supplies a value, put it in the "Lives in" location and tick it. A CI guard (`scripts/assert-production-ready.ts`) fails production builds while `src/lib/site-config.ts` still contains `[`.

Matches section 13 of the implementation plan.

## Brand and contact (`src/lib/site-config.ts`)

| Placeholder                               | Meaning                                                                | Needed by changes | Done |
| ----------------------------------------- | ---------------------------------------------------------------------- | ----------------- | ---- |
| `[Brand Name]`                            | Trading name shown in the logo and copy                                | all               | ☐    |
| `[Registered Business Name]`              | CAC-registered name (legal pages, footer ©)                            | 02, 21            | ☐    |
| `[Distributor Name]`                      | Person's name (About, hero alt text, host bio)                         | 10, 13, 17        | ☐    |
| `[City]`, `[State]`                       | Main city                                                              | all               | ☐    |
| `[Area 1..n]`                             | Service areas for the trust bar and About                              | 10, 17            | ☐    |
| `[2348000000000]` / `[+234 800 000 0000]` | WhatsApp Business number                                               | 02, 05, all CTAs  | ☐    |
| `[+2348000000000]` / `[0800 000 0000]`    | Call number (may equal WhatsApp)                                       | 02, 19            | ☐    |
| `hello@[domain]`                          | Email (Cloudflare Email Routing → Gmail)                               | 02, 19, 21        | ☐    |
| `[domain]`                                | Website domain (`.com.ng` recommended)                                 | 00, 07            | ☐    |
| `[Street]`, address                       | Pickup/shop address                                                    | 19, 17            | ☐    |
| Social URLs                               | Instagram, Facebook, TikTok, YouTube, WhatsApp Channel                 | 02                | ☐    |
| Luma calendar URL + ID                    | Seminar calendar                                                       | 13                | ☐    |
| `[N]` years of experience                 | About, hero                                                            | 10, 17            | ☐    |
| Logo / wordmark                           | SVG preferred; if none, we set the brand name in Plus Jakarta Sans 800 | 01, 02            | ☐    |
| KEDI badge artwork                        | Official KEDI logo file (allowed by KEDI) for the genuine badge only   | 01                | ☐    |

## Wording checks (client confirms)

| Text                                                                     | Where                                    | Done |
| ------------------------------------------------------------------------ | ---------------------------------------- | ---- |
| "Sourced through KEDI's official channel" (trust bar, About values, FAQ) | 10/02, 17/02, 18                         | ☐    |
| Business opportunity programme facts and support list                    | `content/business.ts`                    | ☐    |
| Returns window and refund timing                                         | `content/legal/delivery-and-returns.mdx` | ☐    |
| Governing state for the terms                                            | `content/legal/terms.mdx`                | ☐    |

## Sheet data (client fills the Sheet)

| Item                                                                                  | Tab                                          | Needed by  | Done |
| ------------------------------------------------------------------------------------- | -------------------------------------------- | ---------- | ---- |
| Full product list with approved text, pack sizes, pack days, NAFDAC numbers           | Products                                     | 04, 11, 12 | ☐    |
| Product photos (or permission to photograph)                                          | Drive folder → `image_ids`                   | 04         | ☐    |
| Categories and descriptions                                                           | Categories                                   | 11         | ☐    |
| Product FAQs                                                                          | Product FAQs                                 | 12         | ☐    |
| Bank name, account name, account number                                               | Settings                                     | 18, 19, 21 | ☐    |
| Opening hours, pickup address                                                         | Settings                                     | 02, 19     | ☐    |
| Delivery areas, fees, timelines                                                       | Delivery                                     | 05, 21     | ☐    |
| First 4–6 seminar topics, day/time, format, venue                                     | Seminar Schedule                             | 13         | ☐    |
| Referral and loyalty rewards                                                          | Settings                                     | 20         | ☐    |
| 3+ customer stories with consent date (and photo/video consent if used)               | Stories                                      | 10, 15     | ☐    |
| Seminar photos/clips from past events                                                 | Highlights (+ "Seminar photos" Drive folder) | 13         | ☐    |
| Wellness videos (YouTube/TikTok links)                                                | Videos                                       | 14         | ☐    |
| First 3–6 articles (we draft them in Google Docs; client sets Ready = Yes to approve) | Articles (+ "Website Articles" Drive folder) | 14         | ☐    |

## Repo content (client sends; developer adds)

| Item                                                                           | Location                                 | Needed by  | Done |
| ------------------------------------------------------------------------------ | ---------------------------------------- | ---------- | ---- |
| Distributor biography (150–250 words) and 3+ professional photos               | `content/about.ts`, `public/images/`     | 10, 13, 17 | ☐    |
| Mission and 3–4 values                                                         | `content/about.ts`                       | 17         | ☐    |
| Business opportunity details (how KEDI's programme works, the support offered) | `content/business.ts`                    | 16         | ☐    |
| Returns policy decisions (window, conditions)                                  | `content/legal/delivery-and-returns.mdx` | 21         | ☐    |

## Accounts and IDs

| Item                                                      | Where it goes              | Done |
| --------------------------------------------------------- | -------------------------- | ---- |
| Cloudflare account (domain on Cloudflare DNS)             | GitHub secrets             | ☐    |
| GitHub repo (client-owned org or transferred at handover) | —                          | ☐    |
| Google account that owns the Sheet and Apps Script        | Apps Script deploy         | ☐    |
| GA4 measurement ID                                        | `VITE_GA4_ID`              | ☐    |
| Meta Pixel ID                                             | `VITE_META_PIXEL_ID`       | ☐    |
| Microsoft Clarity ID                                      | `VITE_CLARITY_ID`          | ☐    |
| Google Search Console verification                        | DNS TXT                    | ☐    |
| Google Business Profile                                   | Linked from footer/contact | ☐    |

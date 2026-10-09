# Design System

The palette is taken from KEDI's own identity, so customers feel they are in the KEDI family. The site still has its own name and wordmark, because it is an independent distributor.

| Source             | Colour                | Sampled from                                            |
| ------------------ | --------------------- | ------------------------------------------------------- |
| KEDI Blue          | `#317ABE`             | KEDI global logo (kedihealth.com), dominant blue square |
| KEDI Sun           | `#F4E028`             | KEDI global logo, yellow crescent/sun                   |
| KEDI Nigeria green | `#6FC73B` / `#67BC00` | kedihealthcare.com.ng logo and site CSS                 |

## 1. Colour tokens

Defined once in `src/styles/app.css` inside `@theme`. Components use **semantic names only**. Contrast ratios are WCAG 2.x against the background they are meant for.

### Brand

| Token          | Hex       | Use                                                                               | Contrast                                                        |
| -------------- | --------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `brand`        | `#317ABE` | Primary buttons, active chips, key icons                                          | White text on it: 4.51 (AA)                                     |
| `brand-hover`  | `#2A68A3` | Hover/pressed of `brand`                                                          | White: 5.82                                                     |
| `brand-strong` | `#245C91` | Links, eyebrow text, prices on white                                              | On white: 6.97; on `brand-soft`: 6.10                           |
| `brand-soft`   | `#E8F1FA` | Tinted section backgrounds, selected rows, product image backdrop                 | `ink` on it: 12.75                                              |
| `brand-muted`  | `#8FC1EE` | Links/accents on `ink` backgrounds                                                | On `ink`: 7.65                                                  |
| `sun`          | `#F4E028` | Highlight backgrounds: offer badges, "this week" tag, sun-arc motif, `sun` button | `ink` text on it: 10.77. **Never text colour on white (1.35).** |
| `sun-hover`    | `#E3CF14` | Hover of `sun` button                                                             |                                                                 |
| `sun-soft`     | `#FDF8D6` | Notice panels (payment safety, offer reminders)                                   | `sun-ink` on it: 5.83                                           |
| `sun-ink`      | `#7A5C00` | Text/icons on `sun-soft`                                                          |                                                                 |
| `ink`          | `#0F2A47` | Headings, dark sections (footer, final CTA band), text on `sun`                   | On white: 14.56                                                 |

### Wellness & status

| Token         | Hex       | Use                                                                    | Contrast       |
| ------------- | --------- | ---------------------------------------------------------------------- | -------------- |
| `leaf`        | `#6FC73B` | Decorative only: icons on dark, illustration accents, check-mark fills | Not for text   |
| `leaf-strong` | `#2F6F14` | "In stock" text, success messages                                      | On white: 6.17 |
| `leaf-soft`   | `#EEF7E6` | Success/in-stock badge background                                      |                |
| `danger`      | `#B42318` | Errors, "Out of stock" text                                            | On white: 6.57 |
| `danger-soft` | `#FEF3F2` | Error panels                                                           |                |

### WhatsApp (fixed, recognisable)

| Token            | Hex       | Use                                                                                                           |
| ---------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `whatsapp`       | `#25D366` | WhatsApp button background (WhatsApp's own brand green)                                                       |
| `whatsapp-hover` | `#1EBE5A` | Hover                                                                                                         |
| `whatsapp-ink`   | `#0B2E1A` | Text and glyph on WhatsApp buttons (7.46). White text on `#25D366` fails contrast (1.98), so never use white. |

### Neutrals

| Token          | Hex                 | Use                                          |
| -------------- | ------------------- | -------------------------------------------- |
| `canvas`       | `#FFFFFF`           | Page background                              |
| `surface`      | `#F7F9FC`           | Alternate section background, cards on white |
| `line`         | `#E3E8EF`           | Borders, dividers                            |
| `line-strong`  | `#CBD5E1`           | Input borders                                |
| `text-heading` | `#0F2A47` (= `ink`) | Headings                                     |
| `text-body`    | `#4A5A6A`           | Body copy (7.09 on white)                    |
| `text-muted`   | `#5D6B78`           | Captions, helper text (5.47 on white)        |

Light theme only. No dark mode.

## 2. Typography

- **Family:** Plus Jakarta Sans Variable (`@fontsource-variable/plus-jakarta-sans`), Latin subset only, `font-display: swap`. It is a friendly, rounded geometric sans close to the bold, open letterforms of the KEDI wordmark, and it reads well at small sizes on low-end Android screens. Fallback: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Only one font file, to protect 3G load time.

| Token          | Mobile    | md+       | Weight                          | Leading | Use                                 |
| -------------- | --------- | --------- | ------------------------------- | ------- | ----------------------------------- |
| `text-display` | 2.25rem   | 3.5rem    | 800                             | 1.05    | Home hero headline only             |
| `text-h1`      | 2rem      | 2.75rem   | 800                             | 1.1     | Page titles                         |
| `text-h2`      | 1.625rem  | 2.25rem   | 700                             | 1.15    | Section titles                      |
| `text-h3`      | 1.25rem   | 1.375rem  | 700                             | 1.25    | Card titles, sub-sections           |
| `text-lead`    | 1.125rem  | 1.25rem   | 400                             | 1.55    | Intro paragraphs                    |
| `text-base`    | 1rem      | 1rem      | 400                             | 1.6     | Body (never smaller for paragraphs) |
| `text-sm`      | 0.875rem  | 0.875rem  | 500                             | 1.5     | Helper text, meta                   |
| `text-eyebrow` | 0.8125rem | 0.8125rem | 700, uppercase, tracking 0.12em | 1.3     | Section eyebrows, in `brand-strong` |
| `text-price`   | 1.25rem   | 1.5rem    | 800, `tabular-nums`             | 1.1     | Prices                              |

Headings use `text-balance`. Paragraphs max width `65ch`.

## 3. Shape, elevation, spacing

| Token            | Value                                                         | Use                                      |
| ---------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `radius-sm`      | 8px                                                           | Badges, small chips                      |
| `radius-md`      | 12px                                                          | Inputs, small cards, images inside cards |
| `radius-lg`      | 16px                                                          | Cards                                    |
| `radius-xl`      | 24px                                                          | Hero panels, CTA bands                   |
| `radius-full`    | 9999px                                                        | Buttons, filter chips, avatar            |
| `shadow-card`    | `0 1px 2px rgb(15 42 71 / 6%), 0 4px 16px rgb(15 42 71 / 6%)` | Cards at rest                            |
| `shadow-overlay` | `0 12px 40px rgb(15 42 71 / 18%)`                             | Drawer, floating WhatsApp button         |

- **Container:** `max-w-6xl`, padding `px-4` (mobile), `md:px-6`, `lg:px-8`.
- **Section spacing:** `py-14 md:py-20`. Tight sections `py-10 md:py-14`.
- **Grid gaps:** 16px mobile, 24px md+.
- **Breakpoints:** Tailwind defaults (sm 640, md 768, lg 1024, xl 1280). Design at 360 first.
- **Tap targets:** at least 44×44px. Buttons are 48px tall by default (`md`), 40px (`sm`), 56px (`lg`).

## 4. Signature motif: the sun arc

KEDI's logo has a yellow crescent rising out of a blue field. The site echoes it with its own **sun arc**, without copying the logo:

- A `sun` half-disc (semicircle) placed behind the hero photo, bottom-anchored, at roughly 70% of the photo's width.
- A small `sun` dot (8px) before each eyebrow label.
- A thin `sun` underline (4px, radius-full) under the active nav item.

It is a decorative SVG/CSS shape (`aria-hidden`), never an image of the KEDI logo.

## 5. Primitives (`src/components/ui`)

Built in change `01-add-design-system`. Every page uses these; do not restyle them at call sites.

| Component                                                        | Variants / props                                                                                                                                                                | Notes                                                                                                                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                         | `variant`: `primary` (brand), `secondary` (outline brand-strong), `whatsapp`, `sun`, `ghost`, `link`; `size`: `sm`, `md`, `lg`; `fullWidth`; renders `<a>` when `href` is given | Focus ring 3px `brand` at 40% opacity, offset 2px. Disabled = 50% opacity. Loading state shows a spinner and keeps width.                                                          |
| `WhatsAppIcon`                                                   | `size`                                                                                                                                                                          | Official glyph SVG. Used only inside WhatsApp actions.                                                                                                                             |
| `Badge`                                                          | `neutral`, `brand`, `stock` (leaf-soft/leaf-strong), `out` (danger-soft/danger), `offer` (sun/ink)                                                                              | `radius-sm`, `text-sm` 600                                                                                                                                                         |
| `Card`                                                           | `as`, `interactive`                                                                                                                                                             | `surface` or `canvas` with `line` border and `shadow-card`. Interactive cards change border to `brand` on hover/focus; no lift.                                                    |
| `Price`                                                          | `amountNgn: number \| null`, `size`                                                                                                                                             | `₦18,500` with `tabular-nums`; `null` renders "Ask for price" in `brand-strong`                                                                                                    |
| `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `PhoneInput` | `label`, `hint`, `error`, `required`                                                                                                                                            | Label always visible (no placeholder-only labels). Error text in `danger` with an icon; `aria-describedby` wiring. `PhoneInput` shows a fixed "+234" prefix and `inputmode="tel"`. |
| `ChipGroup`                                                      | single-select chips                                                                                                                                                             | Category filters. Horizontal scroll on mobile with fade edges. `aria-pressed`.                                                                                                     |
| `Accordion`                                                      | native `<details>`/`<summary>`                                                                                                                                                  | Works without JS. Chevron rotates.                                                                                                                                                 |
| `Drawer`                                                         | right side (md+) / bottom sheet (mobile)                                                                                                                                        | `@base-ui/react` Dialog. Focus trap, Esc, overlay click closes, `inert` background.                                                                                                |
| `Toast`                                                          | `polite` live region                                                                                                                                                            | "Added to cart" etc. Auto-dismiss 3s, pausable.                                                                                                                                    |
| `Breadcrumbs`                                                    | `items`                                                                                                                                                                         | Schema.org BreadcrumbList is added by the SEO change.                                                                                                                              |
| `ResponsiveImage`                                                | `image: GeneratedImage`, `sizes`, `priority`                                                                                                                                    | `<picture>` with AVIF + WebP `srcset` from the generated set, width/height to prevent layout shift, `loading="lazy"` unless `priority`.                                            |
| `VideoEmbed`                                                     | `provider: "youtube" \| "tiktok"`, `id`, `title`                                                                                                                                | Click-to-load facade (thumbnail + play button). The iframe loads only on tap (youtube-nocookie).                                                                                   |
| `Prose`                                                          | —                                                                                                                                                                               | Article typography for MDX.                                                                                                                                                        |
| `Disclaimer`                                                     | `kind: "health" \| "earnings"`                                                                                                                                                  | Renders the exact text from `docs/copy-and-compliance.md`.                                                                                                                         |
| `Notice`                                                         | `tone: "info" \| "sun" \| "success" \| "danger"`                                                                                                                                | Inline panels.                                                                                                                                                                     |

## 6. Marketing blocks (`src/components/marketing`)

| Block           | Purpose                                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| `SiteSection`   | Section wrapper: `tone` (`canvas`, `surface`, `brand-soft`, `ink`), `spacing` (`default`, `tight`), container on/off |
| `SectionHeader` | Eyebrow (with sun dot) + title + description; `align` left/center; `as` h1/h2                                        |
| `SunArc`        | The decorative motif (section 4)                                                                                     |
| `CtaBand`       | Rounded `ink` panel with title, text and up to 2 actions                                                             |
| `ProductCard`   | Image, name, benefit line, price/Ask, stock badge, Add to cart                                                       |
| `SeminarCard`   | Date block, topic, time, format, Register button                                                                     |
| `StoryCard`     | Quote, first name + area, photo or initials                                                                          |
| `ArticleCard`   | Cover, topic, title, reading time                                                                                    |
| `TrustItem`     | Icon + short label (trust bar)                                                                                       |
| `StepList`      | Numbered steps (how ordering works, how referrals work)                                                              |

## 7. Iconography

- `lucide-react`, stroke width 1.75, sizes 20 (inline) and 24 (feature icons).
- Feature icons sit in a 44px `brand-soft` circle with `brand-strong` icon.
- Approved mapping: genuine = `BadgeCheck`, seminar = `Presentation`, follow-up = `MessageCircleHeart`, delivery = `Truck`, education = `BookOpen`, personal help = `HandHeart`, pickup = `Store`, payment = `Landmark`, referral = `Gift`, calendar = `CalendarDays`, location = `MapPin`, clock = `Clock`, phone = `Phone`, email = `Mail`.
- No medical icons (no pills, syringes, hearts with ECG lines, crosses).

## 8. Imagery

| Use                | Aspect              | Notes                                                                     |
| ------------------ | ------------------- | ------------------------------------------------------------------------- |
| Product main image | 1:1                 | Packshot centred on white or `brand-soft`, at least 1200px source         |
| Hero photo         | 4:5 mobile, 5:4 md+ | The distributor (real person), warm light, smiling, holding/near products |
| Story photo        | 1:1                 | Customer with consent; otherwise initials avatar                          |
| Article cover      | 16:9                | Lifestyle (food, walking, family). No clinical imagery.                   |
| Seminar highlights | 4:3                 | Real seminar photos                                                       |

Alt text: describe the image plainly ("[Distributor Name] holding a pack of [Product]"). Decorative images use `alt=""`.

## 9. Motion

- One reveal pattern: fade in + 8px rise, 300ms, ease-out, once per element, staggered 60ms in grids. Built with `motion` and disabled under `prefers-reduced-motion`.
- Drawer slides 200ms. Toast fades 150ms.
- No parallax, no auto-playing carousels, no hover lift or scale.

## 10. Voice in UI

- Button labels are verbs: "Add to cart", "Send order on WhatsApp", "Register free", "Chat with us".
- Sentence case everywhere except eyebrows.
- Prices always as `₦18,500` (no decimals, comma thousands).
- Dates as `Saturday, 12 October`; times as `4:00 PM` with "WAT" on seminar pages.

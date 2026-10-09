## Why

The weekly seminar is the main conversion channel (plan §3.3 page 4, §5). This page must turn interest into a registration, with the right phone number and consent captured by Luma, and reassure people that it's free, useful and not a sales trap.

## What Changes

`/seminars` → `src/features/seminars/view.tsx`:

| #   | Folder                              | Section                                                                                                     |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | `sections/01-this-weeks-seminar`    | Hero: next seminar topic, date, time, format, venue, who should attend, Register (or the no-upcoming state) |
| 2   | `sections/02-luma-registration`     | `#register`: embedded Luma registration (click-to-load), direct link, and a fallback interest form          |
| 3   | `sections/03-what-youll-learn`      | 3–4 learn points + seminar-only offer note                                                                  |
| 4   | `sections/04-host`                  | Host bio and photo                                                                                          |
| 5   | `sections/05-upcoming-and-calendar` | Later seminars list + "Get notified of every seminar" (Luma calendar)                                       |
| 6   | `sections/06-past-highlights`       | Photos, clips, attendee comments                                                                            |
| 7   | `sections/07-seminar-faq`           | Is it free? How long? Can I bring someone? …                                                                |

## Capabilities

### New Capabilities

- `seminars/page`, `seminars/this-weeks-seminar`, `seminars/registration`, `seminars/what-youll-learn`, `seminars/host`, `seminars/upcoming-and-calendar`, `seminars/past-highlights`, `seminars/seminar-faq`.

## Impact

- Depends on 01, 02, 03 (`seminar_interest` intake), 04 (Seminar Schedule and Highlights tabs), 07 (Event JSON-LD), 08 (FAQs, about/host), and `SeminarCard` from `10-add-home-page/sections/05`.
- Client inputs: seminar schedule rows with Luma event IDs, Luma calendar URL/ID, host bio and photo, `Highlights` rows (photos in the "Seminar photos" Drive folder, clip links, comments with consent dates), `seminar_offer_text`.

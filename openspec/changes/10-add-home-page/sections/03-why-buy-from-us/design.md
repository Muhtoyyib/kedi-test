## Layout

- `SiteSection tone="canvas"`.
- Header: eyebrow "Why buy from us", title "More than a stockist", description "Anyone can sell you a pack. We make sure you know how to use it, and we stay with you after."
- Mobile: cards stacked (`grid gap-4`). md: `grid-cols-2`. lg: `grid-cols-3`, where the first 2 rows hold the 5 cards and the 6th cell is the supporting photo (4:3, rounded-card); if no photo, the 6th cell is a `brand-soft` card with a WhatsApp prompt ("Have a question? Ask us on WhatsApp" + whatsapp button sm).
- Card: `Card` with `p-6`, icon circle (44px brand-soft), `text-h3` title, body `text-base`.

## Content (exact)

| Icon                 | Title                | Body                                                                                                                 |
| -------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `BookOpen`           | Learn before you buy | Our free seminars and articles explain what each product is for and how to use it properly.                          |
| `HandHeart`          | Help choosing        | Tell us about your routine on WhatsApp. We'll suggest what fits, and tell you honestly when something isn't for you. |
| `MessageCircleHeart` | We check in          | We message you a few days after delivery, again two weeks later, and before your pack runs out.                      |
| `Presentation`       | Free weekly seminars | Join our wellness seminar every week to ask questions in person or online.                                           |
| `BadgeCheck`         | Reliable service     | Genuine stock, clear prices, payment only to our business account, and delivery you can count on.                    |

## Behaviour

Cards are static (not links). `Reveal` stagger on scroll.

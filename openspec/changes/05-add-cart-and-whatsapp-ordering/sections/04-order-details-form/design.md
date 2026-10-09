## Fields

| Field                        | Control                                                                                                     | Validation (on blur and on send)     | Error text                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------- |
| Full name                    | `Input` `autocomplete="name"`                                                                               | 2–60 chars, at least one letter      | "Enter your name so we know who's ordering"                 |
| WhatsApp number              | `PhoneInput`                                                                                                | `normalizeNigerianPhone` succeeds    | "Enter a Nigerian mobile number, e.g. 0803 123 4567"        |
| Delivery area                | `Select` with groups: Local areas · Interstate · Pickup ("Pick up from our shop") · "Other (we'll confirm)" | required                             | "Choose where we should deliver"                            |
| Other area                   | `Input` shown only for Other                                                                                | 2–80 chars                           | "Tell us your area"                                         |
| Referral code (optional)     | `Input` uppercase, pre-filled, with "Applied ✓" badge when pre-filled                                       | `^[A-Z]{2,12}-\d{4}[A-Z]?$` or empty | "This code doesn't look right. Check it or leave it empty." |
| Follow-up consent (optional) | `Checkbox` unticked                                                                                         | —                                    | —                                                           |
| Honeypot                     | `Input name="company"` visually hidden, `tabIndex=-1`, `autocomplete="off"`, `aria-hidden`                  | —                                    | —                                                           |

- Each area option shows its fee: "Ikeja — ₦2,500 · Same day if confirmed before 2 PM". Pickup shows "Free".
- Consent label (exact): "Send me usage tips and a reminder on WhatsApp when my pack is running low. Reply STOP anytime." followed by a "Privacy policy" link.
- Section heading inside the drawer: `text-h3` "Your details", helper `text-sm text-text-muted` "We use these to confirm your order on WhatsApp."
- First focus on any field tracks `begin_checkout`.

## Remembering details

Saved on successful send: name, phone, area, areaOther. Pre-filled next time, with a "Not you? Clear details" link.

## Validation UX

Errors appear on blur after a field has been touched, and for all fields on send. On send with errors, focus moves to the first invalid field and a summary at the top of the form says "Please fix 2 fields to send your order" (`role="alert"`).

## Layout

`SiteSection tone="canvas"`, `id="register"`, `scroll-mt-24`. md+: two columns (embed left 7/12; "What happens next" right 5/12).

**Embed area (before load):** a `rounded-panel border border-line bg-surface p-6` placeholder, min-height 520px (to reserve space), containing: h2 "Register for {topic}", "It takes about a minute. You'll get a confirmation email and a WhatsApp reminder.", `Button primary lg` "Register free", and a `link` "Or open the registration page" → `luma_url` (new tab).

**After load:** an `<iframe src="https://lu.ma/embed/event/{luma_event_id}/simple" title="Register for {topic}" width="100%" height="600" class="rounded-panel border border-line" allow="fullscreen; payment" loading="eager">`. A 10-second timeout watchdog: if the iframe's `load` event has not fired, show the fallback.

**What happens next** (`StepList`):

1. "Register here. It's free."
2. "Save our WhatsApp number when we message you, so you get the link and reminders."
3. "Get a reminder the day before and an hour before."
4. "Join us, ask anything, and take home practical tips."

**Fallback interest form** (if no event ID, or the embed failed): h3 "Leave your details and we'll register you", fields: Name, WhatsApp number (`PhoneInput`), consent checkbox (exact consent text from `docs/copy-and-compliance.md` §5), hidden honeypot, `Button primary` "Send my details". POSTs `{type:"seminar_interest", payload:{name, phone, seminarId, consent:true}}`. Success → `/thank-you/seminar`; error → inline `Notice tone="danger"` "Something went wrong. Please try again or message us on WhatsApp." with a WhatsApp button.

## Consent note

Under the embed, `text-sm text-text-muted`: "By registering you agree to receive WhatsApp messages about this seminar. Reply STOP anytime. [Privacy policy](/privacy)". This mirrors the Luma consent question.

## Layout

`SiteSection tone="canvas"`, `id="interest"`, `max-w-xl`, `Card p-6 md:p-8`.

- h2 "Register your interest", text "We'll message you on WhatsApp within one working day."

| Field                        | Control                                                                                                          | Validation      | Error                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------- |
| Full name                    | Input                                                                                                            | 2–60 chars      | "Enter your name"                                    |
| WhatsApp number              | PhoneInput                                                                                                       | Nigerian mobile | "Enter a Nigerian mobile number, e.g. 0803 123 4567" |
| City / area                  | Input                                                                                                            | 2–60            | "Tell us where you're based"                         |
| Current occupation           | Select: Employed · Self-employed / business owner · Student · Not currently working · Retired · Other (optional) | —               | —                                                    |
| What would you like to know? | Textarea, 500 max, optional                                                                                      | ≤ 500           | "Keep it under 500 characters"                       |
| Consent                      | Checkbox (exact text §5)                                                                                         | required        | "Please tick to agree so we can message you"         |
| Honeypot                     | hidden `company`                                                                                                 | —               | —                                                    |

- Submit: `Button primary lg fullWidth` "Register my interest" (loading while posting).
- Success → navigate to `/thank-you/business`, track `form_submit {form_id:"business_interest"}`.
- Errors: `rate_limited` → "You've sent this a few times already. We'll be in touch, or message us on WhatsApp."; network/server → "Something went wrong. Please try again, or message us on WhatsApp." (+ WhatsApp button with the business message). Track `form_error`.
- Under the button: `Disclaimer kind="earnings"`.

## Fields

| Field            | Control                                                                                           | Validation       | Error                                                |
| ---------------- | ------------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------- |
| Full name        | Input                                                                                             | 2–60             | "Enter your name"                                    |
| WhatsApp number  | PhoneInput                                                                                        | Nigerian mobile  | "Enter a Nigerian mobile number, e.g. 0803 123 4567" |
| Email (optional) | Input `type=email`                                                                                | valid if present | "Enter a valid email or leave it empty"              |
| Topic (optional) | Select: Product question · Order or delivery · Seminars · Becoming a distributor · Something else | —                | —                                                    |
| Message          | Textarea 1,000 max                                                                                | 5–1,000          | "Tell us a little more (at least 5 characters)"      |
| Consent          | Checkbox (exact text §5)                                                                          | required         | "Please tick to agree so we can reply"               |
| Honeypot         | hidden `company`                                                                                  | —                | —                                                    |

- h2 "Send us a message", helper "Prefer WhatsApp? It's faster: [Chat now]".
- Submit: `Button primary lg` "Send message". Success → `/thank-you/contact` + `form_submit {form_id:"contact"}`. Errors as in the business form (same messages).
- Note under the form: "Please don't include medical details. For health concerns, speak to a doctor."

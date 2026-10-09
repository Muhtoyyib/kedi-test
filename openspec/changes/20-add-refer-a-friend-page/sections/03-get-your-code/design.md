## Layout

`SiteSection tone="canvas"`, `id="get-your-code"`, `max-w-xl`, `Card p-6 md:p-8`.

- h2 "Get your personal link"
- Fields: First name (Input, 2–30, letters), WhatsApp number (PhoneInput), consent (exact §5 text; required), honeypot.
- Helper under the phone field: "Your code uses your first name and the last 4 digits of your number, for example AMAKA-4821. We never show your full number."
- Submit: `Button primary lg fullWidth` "Get my link".

## On submit

1. Validate. Generate `code = createReferralCode(firstName, phone)`, `link = buildReferralLink(code)`.
2. Show the result immediately: `bg-leaf-soft rounded-card p-4` with "Your code" (large, `text-h2 font-extrabold tracking-wide text-ink`) and the link (`text-sm break-all`).
3. `registerReferralCode({firstName, phone, code, consent:true})` in the background (no spinner). On failure after one retry, show a small note: "We couldn't save your code just now. It still works; we'll match it when your friend orders."
4. Store `{firstName, code}` on the device; track `referral_code_created` and `form_submit {form_id:"referral_code"}`.
5. The form collapses to "Signed in as {firstName} · {code} — Not you? Start again".

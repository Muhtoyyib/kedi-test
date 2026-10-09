## Decisions

- Route `src/routes/refer.tsx`. Meta: "Refer a friend | {Brand}"; description "Share your personal link. When a friend places their first order with {Brand}, you both get a reward."
- Sections 03 and 04 are one client island: once a code exists, the share panel appears below the form (and the form collapses to a summary with "Not you? Start again").
- The generated code is remembered on the device (`localStorage["my-referral:v1"] = {firstName, code}`), so returning customers see their link immediately. The phone number is **not** stored; only the code, which contains the last 4 digits.

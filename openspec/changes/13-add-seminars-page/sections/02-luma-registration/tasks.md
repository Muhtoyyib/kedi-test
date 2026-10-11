## 1. Build

- [x] 1.1 `LumaEmbed` (click-to-load, auto-load on `#register` arrival, 10 s watchdog → `onError`)
- [x] 1.2 `SeminarInterestForm` with validation, honeypot, POST via `src/lib/forms/submit.ts` (shared form submitter: text/plain JSON, 10 s timeout, maps `{ok:false, code}` to UI states) + tests for submit.ts
- [x] 1.3 `Registration` section composing both with "What happens next"
- [x] 1.4 Tests: no iframe before click; click inserts iframe with the correct src and title; missing event ID shows the form; watchdog shows the form; form success navigates to /thank-you/seminar and tracks `form_submit {form_id:"seminar_interest"}`; error state

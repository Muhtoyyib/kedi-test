## Why

The footer is where careful buyers check legitimacy: real address, hours, phone, legal pages, and an honest statement that this is an independent distributor. It also holds the short health disclaimer required on a wellness site.

## What Changes

- `bg-ink` footer with: lockup and one-line promise, a WhatsApp button, four link columns, contact block (address, hours, phone, email), social icons, the independent-distributor statement, the short health disclaimer, © line with the registered business name.

Spec: `../../specs/site-shell/footer/spec.md`

## Impact

- `src/components/layout/site/footer.tsx` (+ small subcomponents if it exceeds 250 lines)
- Reads categories (Shop column) and settings (hours, pickup address) from the catalog.
- Client inputs: registered business name, address, hours, socials, email.

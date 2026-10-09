## Why

Buyers trust a person. The About page tells the distributor's story, states plainly that the business is an independent KEDI distributor, and shows where it operates (plan §3.3 page 8).

## What Changes

`/about` → `src/features/about/view.tsx`:

| #   | Folder                                          | Section                                             |
| --- | ----------------------------------------------- | --------------------------------------------------- |
| 1   | `sections/01-story`                             | h1, photo, story, years of experience               |
| 2   | `sections/02-mission-values`                    | Mission line and 3–4 values                         |
| 3   | `sections/03-independent-distributor-statement` | The exact statement and what it means for customers |
| 4   | `sections/04-location-and-service-areas`        | Address, hours, service areas, delivery link        |
| 5   | `sections/05-cta`                               | Meet us at a seminar / chat on WhatsApp             |

## Capabilities

### New Capabilities

- `about/page`, `about/story`, `about/mission-values`, `about/independent-distributor`, `about/location-and-service-areas`, `about/cta`.

## Impact

- Depends on 01, 02, 04 (settings), 08 (`content/about.ts`).
- Client inputs: bio, photos, years of experience, mission and values, address, service areas.

## Layout

- `id="facts"`, h2 "Product facts".
- `dl` as a two-column table (`grid grid-cols-[auto_1fr] gap-x-6 gap-y-3`, rows divided by `border-line`):
  - "NAFDAC reg. no." → value (omitted row if null)
  - "Pack size" → `packSize`
  - "Lasts about" → `formatPackDuration(packDays)` without "Lasts about" prefix (e.g. "4 weeks at the recommended use")
  - "Category" → link to category
  - "Product code" → `id` (monospace `tabular-nums`) + a small "Copy" button (copies, toast "Product code copied")
- Under the list (`text-sm text-text-muted`): "You can verify NAFDAC registration on the NAFDAC website." with a link to `https://www.nafdac.gov.ng` (`rel="noopener"`), shown only when a NAFDAC number exists.

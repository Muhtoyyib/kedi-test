## Decisions

- One route file per page (`privacy.tsx`, `terms.tsx`, `health-disclaimer.tsx`, `delivery-and-returns.tsx`) using `getLegalPage(slug)` and `LegalLayout`.
- Meta: `{title} | {Brand}`, description from frontmatter.
- MDX components available: `DeliveryTable`, `BankDetails`, `Disclaimer`, `Callout`.
- `updated` frontmatter must be changed whenever the text changes (a test compares git-tracked content hash with a stored hash per page and fails if the text changed but `updated` did not; optional stretch).

## Why

Delivery fees, timelines and returns are among the most common questions. The page must show the live delivery table from the Sheet.

## What Changes

- `content/legal/delivery-and-returns.mdx` with `<DeliveryTable />` (from the Delivery tab), pickup info, payment safety (`<BankDetails />`), and the returns policy.

Spec: `../../specs/legal/delivery-and-returns/spec.md`

## Impact

- `DeliveryTable` MDX component (`src/components/mdx/delivery-table.tsx`).
- Client inputs: returns rules (window, conditions), courier used.

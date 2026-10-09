## Decisions

- **External store** with `useSyncExternalStore`: `subscribe`, `getSnapshot` (memoised parsed cart), `getServerSnapshot` (empty cart, so prerender is deterministic).
- **Parsing:** `parseCart(raw: string | null): Cart` → on JSON error, wrong version or invalid lines, returns an empty cart and overwrites storage. Unknown product IDs are kept in storage but filtered out by selectors (the catalog may be stale in an old tab); they are pruned on the next write.
- **Reducer actions:** `add(productId, qty=1)` (merges, clamps to 20, refuses a 21st line with result `"limit"`), `setQty(productId, qty)` (0 removes), `remove(productId)`, `clear()`.
- **Selectors:** `selectLines(cart, catalog)` → `{product, qty, lineTotalNgn | null}[]` in insertion order; `selectSubtotal` (sum of priced lines); `selectHasAskPrice`; `selectCount` (sum of qty); `selectRemovedProducts` (IDs not in the catalog, for a one-time notice).
- **Out-of-stock products** can't be added (the add control shows "Ask on WhatsApp" instead). If a product in the cart goes out of stock, it stays, with an "Out of stock — we'll confirm" badge.
- `useCart()` returns `{lines, count, subtotalNgn, hasAskPrice, add, setQty, remove, clear}`.

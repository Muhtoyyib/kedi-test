## Layout

- `SiteSection tone="surface" spacing="tight"`, `py-6 md:py-8`.
- Mobile: `grid grid-cols-2 gap-4`; md+: `grid-cols-4 gap-6`, separated by `border-l border-line` (except the first).
- Each `TrustItem`: 44px `brand-soft` circle icon (`brand-strong`) + 2-line label `text-sm font-semibold text-ink` and a sub-label `text-sm text-text-muted`.

## Content (exact)

| Icon                       | Label                  | Sub-label                               |
| -------------------------- | ---------------------- | --------------------------------------- |
| KEDI badge or `BadgeCheck` | Genuine KEDI products  | Sourced through KEDI's official channel |
| `Presentation`             | Free wellness seminars | Every week, in person or online         |
| `MessageCircleHeart`       | Personal follow-up     | We check in after you buy               |
| `Truck`                    | Delivery across [City] | And nationwide by courier               |

The sub-label "Sourced through KEDI's official channel" must be confirmed by the client (it is listed in `docs/client-inputs.md` as a wording check). Until confirmed, use "Genuine stock, never repackaged".

## Behaviour

Static. No links (avoid distracting from the hero actions). Items are a `<ul>` with `role="list"`.

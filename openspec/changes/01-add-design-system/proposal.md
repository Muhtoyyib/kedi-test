## Why

Every page shares the same colours, type, buttons, cards and form fields. If each section invents its own, the site will look inconsistent, fail contrast checks, and drift from the KEDI look the client wants. Building the system once, before pages, lets section changes stay small and consistent.

## What Changes

- Add the token layer in `src/styles/app.css` (`@theme`): the KEDI-derived palette, typography scale, radii, shadows, container and section spacing, exactly as in `docs/design-system.md` §1–3.
- Load **Plus Jakarta Sans Variable** (Latin subset) as the only font.
- Add primitives in `src/components/ui/`: `Button`, `WhatsAppIcon`, `Badge`, `Card`, `Price`, `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `PhoneInput`, `ChipGroup`, `Accordion`, `Drawer`, `Toast` (+ `useToast`), `Breadcrumbs`, `ResponsiveImage`, `VideoEmbed`, `Prose`, `Disclaimer`, `Notice`, `Spinner`, `VisuallyHidden`.
- Add marketing blocks in `src/components/marketing/`: `SiteSection`, `SectionHeader`, `SunArc`, `CtaBand`, `StepList`, `TrustItem`, `Reveal` (motion wrapper). Cards specific to a domain (`ProductCard`, `SeminarCard`, `StoryCard`, `ArticleCard`) are built in the first change that needs them.
- Add pure formatting helpers in `src/lib/format/`: `formatNaira`, `formatPackDuration`, `formatSeminarDate`, `formatSeminarTime`, `formatPhoneDisplay`.
- Add a development-only style guide route `/styleguide` showing every token and primitive (not prerendered, not in the sitemap, returns 404 in production).

## Capabilities

### New Capabilities

- `design-system/tokens`: the palette, type and spacing contract, including contrast guarantees.
- `design-system/primitives`: behaviour of shared interactive primitives (buttons, form fields, drawer, accordion, toast, media).

## Impact

- Depends on `00-setup-project-foundation`.
- Client inputs: brand wordmark (optional; text wordmark is the fallback), KEDI badge artwork (for the `Genuine KEDI products` badge).
- New dependencies: `@fontsource-variable/plus-jakarta-sans`.

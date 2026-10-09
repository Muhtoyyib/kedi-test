## Context

The visual source of truth is `docs/design-system.md`. This document covers how to implement it. Rixl landing's `src/styles/app.css`, `src/components/ui/button.tsx`, `src/components/marketing/site-section.tsx` and `section-header.tsx` are the reference patterns. The oxlint `shadcn/*` rules (no raw colours, no arbitrary values, static classes, no inline styles) apply.

## Goals / Non-Goals

**Goals**

- Utilities such as `bg-brand`, `text-brand-strong`, `bg-sun`, `text-ink`, `bg-whatsapp`, `text-whatsapp-ink`, `border-line`, `bg-surface`, `rounded-card`, `shadow-card` and `text-h2` exist and are the only colour/type utilities pages use.
- All primitives are accessible (keyboard, focus-visible, ARIA) and work at 360px.

**Non-Goals**

- Dark mode.
- Domain cards (product/seminar/story/article). Those land with their first page.

## Decisions

### 1. Token implementation

In `@theme`, use Tailwind 4 namespaces so utilities are generated:

```css
@import "@fontsource-variable/plus-jakarta-sans/wght.css";
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans Variable", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  --color-brand: #317abe;
  --color-brand-hover: #2a68a3;
  --color-brand-strong: #245c91;
  --color-brand-soft: #e8f1fa;
  --color-brand-muted: #8fc1ee;
  --color-sun: #f4e028;
  --color-sun-hover: #e3cf14;
  --color-sun-soft: #fdf8d6;
  --color-sun-ink: #7a5c00;
  --color-ink: #0f2a47;
  --color-leaf: #6fc73b;
  --color-leaf-strong: #2f6f14;
  --color-leaf-soft: #eef7e6;
  --color-danger: #b42318;
  --color-danger-soft: #fef3f2;
  --color-whatsapp: #25d366;
  --color-whatsapp-hover: #1ebe5a;
  --color-whatsapp-ink: #0b2e1a;
  --color-canvas: #ffffff;
  --color-surface: #f7f9fc;
  --color-line: #e3e8ef;
  --color-line-strong: #cbd5e1;
  --color-text-heading: #0f2a47;
  --color-text-body: #4a5a6a;
  --color-text-muted: #5d6b78;

  --radius-badge: 8px;
  --radius-field: 12px;
  --radius-card: 16px;
  --radius-panel: 24px;
  --shadow-card: 0 1px 2px rgb(15 42 71 / 6%), 0 4px 16px rgb(15 42 71 / 6%);
  --shadow-overlay: 0 12px 40px rgb(15 42 71 / 18%);

  --text-display: 2.25rem;
  --text-display--line-height: 1.05;
  --text-h1: 2rem;
  --text-h1--line-height: 1.1;
  --text-h2: 1.625rem;
  --text-h2--line-height: 1.15;
  --text-h3: 1.25rem;
  --text-h3--line-height: 1.25;
  --text-lead: 1.125rem;
  --text-lead--line-height: 1.55;
  --text-eyebrow: 0.8125rem;
  --text-eyebrow--line-height: 1.3;
  --text-price: 1.25rem;
  --text-price--line-height: 1.1;
}
```

The md-size steps (`display` 3.5rem, `h1` 2.75rem, `h2` 2.25rem, `h3` 1.375rem, `lead` 1.25rem, `price` 1.5rem) are applied with responsive variants (`text-h2 md:text-h2-md`), via a second set of tokens `--text-*-md`. The page `SectionHeader` and typography components own these pairs, so sections don't repeat them.

Base layer: `body { @apply bg-canvas text-text-body font-sans text-base antialiased; }`, headings `text-text-heading`, `::selection` `bg-sun text-ink`, and `:focus-visible { outline: 3px solid color-mix(in srgb, var(--color-brand) 45%, transparent); outline-offset: 2px; }`.

### 2. Button

Variant map (static class strings, like Rixl's `buttonVariants`):

| Variant     | Classes (summary)                                                                |
| ----------- | -------------------------------------------------------------------------------- |
| `primary`   | `bg-brand text-white hover:bg-brand-hover`                                       |
| `secondary` | `border-2 border-brand-strong text-brand-strong bg-canvas hover:bg-brand-soft`   |
| `whatsapp`  | `bg-whatsapp text-whatsapp-ink hover:bg-whatsapp-hover` + leading `WhatsAppIcon` |
| `sun`       | `bg-sun text-ink hover:bg-sun-hover`                                             |
| `ghost`     | `text-ink hover:bg-surface`                                                      |
| `link`      | `text-brand-strong underline underline-offset-4 hover:no-underline` (no padding) |

Sizes: `sm` h-10 px-4 text-sm, `md` h-12 px-6 text-base, `lg` h-14 px-7 text-lead. Every button is `rounded-full font-semibold inline-flex items-center justify-center gap-2`. `fullWidth` → `w-full`. With `href`, it renders `<a>`; external links get `rel="noopener"`. A `loading` prop sets `aria-busy`, shows `Spinner` and disables the button. No transform transitions; only `transition-colors`.

### 3. Form fields

- `Field` renders `<label>` (text-sm 600, text-ink), the control slot, then the hint (`text-text-muted`) or error (`text-danger`, with a `CircleAlert` icon) linked through `aria-describedby`. A required marker is the word "(required)" in muted text, not an asterisk.
- Inputs: h-12, `rounded-field`, `border border-line-strong`, `bg-canvas`, focus border `brand`, error border `danger`, `aria-invalid`.
- `PhoneInput`: a non-editable "+234" prefix box joined to the input, `inputmode="tel"`, `autocomplete="tel-national"`. It accepts `0803…`, `803…`, `+234803…` and `234803…`. `normalizeNigerianPhone()` lives in `src/lib/phone.ts` (used by changes 05, 06, 16, 19).
- `Checkbox`: 24px box, tick in `brand`, label text is clickable, minimum 44px row height.

### 4. Drawer

Built on `@base-ui/react` Dialog. Below md it is a bottom sheet (max-h 90dvh, rounded top `rounded-t-panel`, grab handle). From md it is a right panel, 420px wide. Overlay `bg-ink/40`. Focus goes to the title on open and returns to the trigger on close. Body scroll is locked. Esc closes it.

### 5. Media

- `ResponsiveImage` takes a `GeneratedImage` (`docs/content-model.md` §2) and renders `<picture>` with an AVIF `srcset`, a WebP `srcset` and an `<img>` (webp 768w as `src`), plus `width`/`height`, `sizes`, `decoding="async"`. `priority` sets `fetchpriority="high"` and `loading="eager"`. The wrapper has `bg-brand-soft` while loading. For local static images (content imports) there is a sibling `StaticImage` using Vite's asset URL.
- `VideoEmbed` shows a thumbnail (`i.ytimg.com/vi/{id}/hqdefault.jpg` for YouTube; a provided poster for TikTok) with a 64px play button. On click it swaps in the iframe (`youtube-nocookie.com/embed/{id}?autoplay=1`) and calls `track({event:"video_play"})`. The facade is a `<button>` with `aria-label="Play video: {title}"`.

### 6. Accordion

Native `<details name="{group}">` for exclusive-open groups (supported on modern Android Chrome; degrades to multi-open). `<summary>` has a 44px min height, the question text in `text-h3`-sm weight 600, and a `ChevronDown` that rotates via `group-open:rotate-180`.

### 7. Toast

A single region `<div role="status" aria-live="polite">` mounted in the shell. `useToast().show({message, action?})`. Max 1 visible; a new toast replaces the old. Bottom centre on mobile (above the floating WhatsApp button), bottom right from md.

### 8. Formatting helpers

- `formatNaira(18500)` → `₦18,500`; `formatNaira(null)` → `Ask for price`. Uses `Intl.NumberFormat("en-NG", {maximumFractionDigits: 0})` with an explicit `₦` prefix (some Android ICU builds render `NGN`).
- `formatPackDuration(28)` → `Lasts about 4 weeks`; `formatPackDuration(30)` → `Lasts about 30 days`; `formatPackDuration(7)` → `Lasts about 1 week`.
- `formatSeminarDate(iso)` → `Saturday, 12 October`, in `Africa/Lagos`.
- `formatSeminarTime(iso)` → `4:00 PM`.

### 9. Style guide route

`src/routes/styleguide.tsx`: `beforeLoad` throws `notFound()` when `import.meta.env.PROD`. It shows swatches with contrast ratios, the type scale, every button variant and size, form fields in all states, badges, notices, the drawer, toast, accordion, and the media facades with fixture data.

## Risks / Trade-offs

- [`brand` with white text is exactly 4.51:1] → Allowed for buttons (AA for normal text). For long text on blue, use `brand-hover` or `ink` backgrounds instead.
- [Native `<details name>` exclusivity is not universal] → It degrades gracefully to multi-open, which is acceptable.
- [Variable font weight ~40 KB] → Latin subset only; `font-display: swap`; preload in the root head.

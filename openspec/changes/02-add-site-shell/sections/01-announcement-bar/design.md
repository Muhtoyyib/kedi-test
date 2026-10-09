## Layout

- Full-width `bg-ink`, text `text-white text-sm font-medium`, centred, `py-2 px-10` (room for the close button), min height 40px.
- Left of the text: an 8px `bg-sun` dot (the motif).
- With a link: the text is an `<a>` with `underline underline-offset-4 decoration-sun` and a trailing `ArrowRight` 16px icon.
- Dismiss: a 40×40 icon button at the right, `X` icon in `text-brand-muted`, `aria-label="Dismiss announcement"`.
- Not sticky; scrolls away with the page. The header below is sticky.

## Content

- Text from the Sheet, max 90 characters (the parser truncates at a word boundary and logs a warning).
- Example: "Free wellness seminar this Saturday at 4 PM. Register now →"

## Behaviour

- Prerendered visible (no flash for first-time visitors). After hydration, if `localStorage["announcement-dismissed"] === hash(text)` and the dismissal is under 7 days old, it is removed.
- Changing the text in the Sheet shows the bar again, even to visitors who dismissed the old one.

## Accessibility

- `<aside aria-label="Announcement">`.
- The dismiss button keeps focus order sensible: link first, then dismiss.

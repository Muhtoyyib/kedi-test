## Layout and behaviour

- `ChipGroup` (single select) in a horizontal scroll row: "All", then topics in the label order from `topics.ts` that have articles, each with a count.
- Selecting updates `?topic=` (router search params, `replace`). The grid filters client-side. Prerendered HTML shows all.
- Unknown `topic` values are ignored (treated as All).
- Also filters the video library (section 04) by topic.

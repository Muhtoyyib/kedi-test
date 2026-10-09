// name → slug: ASCII fold (accents), lowercase, hyphenate, collapse repeats,
// strip edges. Same rules as apps-script/src/validate.ts slugify, plus accent
// folding for names like "Àdánmá".

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

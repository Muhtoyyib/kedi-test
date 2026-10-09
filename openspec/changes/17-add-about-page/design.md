## Decisions

- Route `src/routes/about.tsx`. Meta: "About us | {Brand}"; description "Meet [Distributor Name], an independent KEDI distributor in {City} with [N] years' experience, and learn how we help customers choose and use KEDI products."
- JSON-LD: add `Person` (the distributor) as `founder` on the LocalBusiness node, page-level.
- `content/about.ts` shape: `{distributor: {name, firstName, photo, photoAlt, yearsOfExperience, story: string[]}, host: {...}, mission: string, values: {icon, title, text}[]}`.

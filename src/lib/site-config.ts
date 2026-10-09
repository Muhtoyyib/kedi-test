// Single source of brand and contact values (docs/content-model.md §3).
// Unfilled client values keep the placeholder form; scripts/assert-production-ready.ts
// blocks production deploys while any remain (docs/client-inputs.md).

export const siteConfig = {
  name: "[Brand Name]",
  legalName: "[Registered Business Name]",
  tagline: "Your trusted KEDI wellness partner in [City]",
  distributorName: "[Distributor Name]",
  city: "[City]",
  state: "[State]",
  serviceAreas: ["[Area 1]", "[Area 2]", "[Area 3]"],
  url: import.meta.env.VITE_SITE_URL,
  whatsapp: {number: "[2348000000000]", display: "[+234 800 000 0000]"},
  phone: {number: "[+2348000000000]", display: "[0800 000 0000]"},
  email: "hello@[domain]",
  address: {street: "[Street]", city: "[City]", state: "[State]", mapsQuery: "[Business Name, Street, City]"},
  socials: {instagram: "[url]", facebook: "[url]", tiktok: "[url]", youtube: "[url]", whatsappChannel: "[url]"},
  luma: {calendarUrl: "[https://lu.ma/...]", calendarId: "[cal-...]"},
  yearsOfExperience: "[N]",
  kedi: {statement: "We are an independent distributor of KEDI Healthcare products."},
} as const;

export function getPageTitle(title?: string) {
  return title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} — ${siteConfig.tagline}`;
}

export function whatsappUrl(message?: string) {
  const url = new URL(`https://wa.me/${siteConfig.whatsapp.number}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}

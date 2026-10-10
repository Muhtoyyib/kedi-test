// About / host content — developer-edited, client-approved. Placeholder
// strings in brackets are the client's to supply (docs/client-inputs.md);
// {city} is resolved from site config by src/lib/content/about.ts.

export type AboutIcon = "BookOpen" | "Scale" | "MessageCircleHeart" | "BadgeCheck";

export interface AboutContent {
  distributor: {
    name: string;
    firstName: string;
    photo: string | null;
    photoAlt: string;
    yearsOfExperience: number | null;
    story: string[];
  };
  host: {
    name: string;
    firstName: string;
    role: string;
    photo: string | null;
    photoAlt: string;
    bio: string[];
    stats: string[];
  };
  mission: string;
  values: {icon: AboutIcon; title: string; text: string}[];
}

export const aboutContent: AboutContent = {
  distributor: {
    name: "[Distributor Name]",
    firstName: "[Distributor First Name]",
    photo: null,
    photoAlt: "[Distributor Name], independent KEDI distributor",
    yearsOfExperience: null,
    story: ["[Distributor biography — 150–250 words supplied by the client.]"],
  },
  host: {
    name: "[Distributor Name]",
    firstName: "[Distributor First Name]",
    role: "Independent KEDI Distributor in {city}",
    photo: null,
    photoAlt: "[Distributor Name], seminar host",
    bio: ["[Host biography — 60–90 words supplied by the client.]"],
    stats: [],
  },
  mission: "To help families in {city} look after their wellbeing with genuine products, honest guidance and real follow-up.",
  values: [
    {icon: "BookOpen", title: "Education first", text: "We explain before we sell."},
    {icon: "Scale", title: "Honesty", text: "We tell you when a product isn't right for you."},
    {icon: "MessageCircleHeart", title: "Follow-up", text: "We check in, and we remember when it's time to reorder."},
    {icon: "BadgeCheck", title: "Genuine products", text: "Sourced through KEDI's official channel, never repackaged."},
  ],
};

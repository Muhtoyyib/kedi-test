// Home-page copy that isn't catalog data. Only wording the client approved
// lives here (docs/copy-and-compliance.md).

export type DifferentiatorIcon = "BookOpen" | "HandHeart" | "MessageCircleHeart" | "Presentation" | "BadgeCheck";

export interface Differentiator {
  icon: DifferentiatorIcon;
  title: string;
  body: string;
}

// "More than a stockist" — the five reasons to buy here (section 03).
export const differentiators: Differentiator[] = [
  {
    icon: "BookOpen",
    title: "Learn before you buy",
    body: "Our free seminars and articles explain what each product is for and how to use it properly.",
  },
  {
    icon: "HandHeart",
    title: "Help choosing",
    body: "Tell us about your routine on WhatsApp. We'll suggest what fits, and tell you honestly when something isn't for you.",
  },
  {
    icon: "MessageCircleHeart",
    title: "We check in",
    body: "We message you a few days after delivery, again two weeks later, and before your pack runs out.",
  },
  {
    icon: "Presentation",
    title: "Free weekly seminars",
    body: "Join our wellness seminar every week to ask questions in person or online.",
  },
  {
    icon: "BadgeCheck",
    title: "Reliable service",
    body: "Genuine stock, clear prices, payment only to our business account, and delivery you can count on.",
  },
];

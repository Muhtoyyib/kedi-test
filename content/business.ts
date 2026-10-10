// Business-opportunity copy — developer-edited, client-confirmed against
// KEDI's official programme. The content lint (scripts/lint-content.ts)
// applies an extra wording list to this file — run it before editing.

export type BusinessIcon =
  | "Store"
  | "Users"
  | "GraduationCap"
  | "Scale"
  | "BookOpen"
  | "Presentation"
  | "MessageCircleHeart"
  | "Megaphone"
  | "HandHeart";

export interface BusinessContent {
  whatItIs: {
    heading: string;
    points: {icon: BusinessIcon; title: string; text: string}[];
    closing: string;
  };
  howItWorks: {title: string; text: string}[];
  support: {icon: BusinessIcon; title: string; text: string; confirmed: boolean}[];
}

export const businessContent: BusinessContent = {
  whatItIs: {
    heading: "What it means to be a KEDI distributor",
    points: [
      {
        icon: "Store",
        title: "You run your own small business",
        text: "You buy genuine KEDI products through the official channel and sell them to your customers.",
      },
      {
        icon: "Users",
        title: "You serve people, not just sell",
        text: "Customers rely on you for guidance, follow-up and reorders, like we do.",
      },
      {icon: "GraduationCap", title: "You keep learning", text: "Product knowledge and wellness education are part of the work."},
      {icon: "Scale", title: "You follow KEDI's rules", text: "Pricing guidance, honest product information and no health claims."},
    ],
    closing: "It suits people who enjoy helping others and are willing to put in steady effort.",
  },
  howItWorks: [
    {title: "Register your interest", text: "Fill in the short form below. We'll message you on WhatsApp."},
    {title: "Attend a business session", text: "Join the business part of our weekly seminar to learn how the programme works."},
    {
      title: "Ask your questions",
      text: "We'll talk through what's involved, KEDI's official registration process and what it costs to start.",
    },
    {title: "Decide in your own time", text: "There's no pressure. If you go ahead, we help you with registration and your first steps."},
  ],
  support: [
    {
      icon: "GraduationCap",
      title: "Training",
      text: "Getting-started sessions on products, ordering and serving customers.",
      confirmed: false,
    },
    {
      icon: "BookOpen",
      title: "Product knowledge",
      text: "Approved product information and how to explain usage correctly.",
      confirmed: false,
    },
    {icon: "Presentation", title: "Seminars", text: "Bring your prospects to our weekly seminars.", confirmed: false},
    {
      icon: "MessageCircleHeart",
      title: "Customer care routines",
      text: "Our follow-up system: day-3 check-ins, reorder reminders and referrals.",
      confirmed: false,
    },
    {
      icon: "Megaphone",
      title: "Marketing help",
      text: "Templates for WhatsApp Status and social posts that follow the rules.",
      confirmed: false,
    },
    {icon: "HandHeart", title: "Mentoring", text: "Regular check-ins with {distributorName}.", confirmed: false},
  ],
};

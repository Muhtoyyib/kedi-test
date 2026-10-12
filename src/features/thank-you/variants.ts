import {siteConfig} from "@/lib/site-config";
import type {ThankYouLayoutProps} from "./thank-you-layout";

// Exact copy per system-pages/thank-you-variants design — one page per form
// type. `referral` is prerendered but currently unused (the refer page shows
// the link inline); it stays for future flows.
const variants = {
  contact: {
    title: "Message received",
    message: "Thank you. We'll reply on WhatsApp, usually within 1 hour during opening hours.",
    steps: [
      {title: `Save our number ${siteConfig.whatsapp.display} so our reply reaches you.`},
      {title: "We'll answer your question or call if needed."},
    ],
    primary: {label: "Browse products", href: "/shop", variant: "primary" as const},
  },
  business: {
    title: "Thanks for your interest",
    message: "We'll message you on WhatsApp within one working day to answer your questions.",
    steps: [
      {title: `Save our number ${siteConfig.whatsapp.display}.`},
      {title: "Join the business session at our next seminar."},
      {title: "Decide in your own time. There's no pressure."},
    ],
    primary: {label: "See seminar dates", href: "/seminars", variant: "sun" as const},
  },
  referral: {
    title: "Your link is ready",
    message: "Share it with friends and family. You'll both be rewarded after their first paid order.",
    steps: [{title: "Share your link on WhatsApp."}, {title: "We'll message you when your reward is due."}],
    primary: {label: "Back to my link", href: "/refer", variant: "primary" as const},
  },
  seminar: {
    title: "You're on the list",
    message: "We'll message you on WhatsApp with the seminar details and a reminder.",
    steps: [{title: `Save our number ${siteConfig.whatsapp.display}.`}, {title: "Look out for our reminder the day before."}],
    primary: {label: "Browse products", href: "/shop", variant: "primary" as const},
  },
} satisfies Record<string, ThankYouLayoutProps>;

export type ThankYouKind = keyof typeof variants;

export function getThankYouVariant(kind: string): ThankYouLayoutProps | null {
  return kind in variants ? variants[kind as ThankYouKind] : null;
}

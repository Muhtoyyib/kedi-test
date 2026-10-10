// FAQ items, seeded from changes 13 (seminars), 16 (business) and 18 (general).
// Answers may contain {tokens} resolved from the Sheet's Settings by
// src/lib/content/faq.ts — an item whose required token is missing is omitted.
// [text](/path) inside an answer becomes a link.

export type FaqGroup = "ordering" | "payment" | "delivery" | "returns" | "products" | "seminars" | "referrals" | "business";

/** Pages a question can appear on. Every item shows on the FAQ page. */
export type FaqPage = "faq" | "seminars" | "business";

export interface FaqItem {
  id: string;
  group: FaqGroup;
  question: string;
  answer: string;
  showOn: FaqPage[];
}

// Display order and labels for the /faq page (change 18).
export const faqGroups: {id: FaqGroup; label: string}[] = [
  {id: "ordering", label: "Ordering"},
  {id: "payment", label: "Payment"},
  {id: "delivery", label: "Delivery"},
  {id: "returns", label: "Returns"},
  {id: "products", label: "Products"},
  {id: "seminars", label: "Seminars"},
  {id: "referrals", label: "Referrals & rewards"},
  {id: "business", label: "Becoming a distributor"},
];

const general: FaqItem[] = [
  {
    id: "are-products-genuine",
    group: "products",
    question: "Are your products genuine?",
    answer:
      "Yes. We're an independent KEDI distributor and buy through KEDI's official distribution channel. Each product shows its NAFDAC number where applicable.",
    showOn: ["faq"],
  },
  {
    id: "how-to-order",
    group: "ordering",
    question: "How do I order?",
    answer:
      'Add products to your cart and tap "Send order on WhatsApp". Your order arrives in our WhatsApp with an order number. We confirm stock and the delivery fee, then send payment details. You can also simply message us.',
    showOn: ["faq"],
  },
  {
    id: "order-without-website",
    group: "ordering",
    question: "Can I order without using the website?",
    answer: "Yes. Message us on WhatsApp with what you need.",
    showOn: ["faq"],
  },
  {
    id: "how-to-pay",
    group: "payment",
    question: "How do I pay?",
    answer:
      "By bank transfer to our business account: {bank}. We only send payment details from our official WhatsApp number. Card payment links are available on request.",
    showOn: ["faq"],
  },
  {
    id: "when-to-pay",
    group: "payment",
    question: "When do I pay?",
    answer: "After we confirm your order and delivery fee on WhatsApp. We dispatch once payment is received.",
    showOn: ["faq"],
  },
  {
    id: "delivery-areas",
    group: "delivery",
    question: "Where do you deliver and how long does it take?",
    answer:
      "{deliveryNote} We deliver across {city} by dispatch rider and nationwide by courier. See [delivery fees and times](/delivery-and-returns).",
    showOn: ["faq"],
  },
  {
    id: "pickup",
    group: "delivery",
    question: "Can I pick up my order?",
    answer: "Yes, from {pickupAddress} during our opening hours: {openingHours}.",
    showOn: ["faq"],
  },
  {
    id: "returns",
    group: "returns",
    question: "Can I return a product?",
    answer:
      "See our [delivery and returns policy](/delivery-and-returns). If something is wrong with your order, message us within 48 hours of delivery.",
    showOn: ["faq"],
  },
  {
    id: "which-product",
    group: "products",
    question: "Which product is right for me?",
    answer:
      "Tell us about your routine on WhatsApp or come to a free seminar. We'll explain the options. For medical conditions, please speak to a doctor first.",
    showOn: ["faq"],
  },
  {
    id: "more-than-one-product",
    group: "products",
    question: "Can I take more than one product?",
    answer: "Ask us on WhatsApp. We'll check the usage instructions with you. If you take medication, speak to your doctor first.",
    showOn: ["faq"],
  },
  {
    id: "refer-a-friend",
    group: "referrals",
    question: "How does Refer a Friend work?",
    answer:
      "Share your personal link. When your friend places their first paid order, you get {referralReward} and they get {referralFriendReward}. [Get your link](/refer).",
    showOn: ["faq"],
  },
  {
    id: "loyalty-reward",
    group: "referrals",
    question: "Do you have a loyalty reward?",
    answer: "{loyaltyText}",
    showOn: ["faq"],
  },
];

const seminars: FaqItem[] = [
  {
    id: "seminar-free",
    group: "seminars",
    question: "Is the seminar really free?",
    answer: "Yes. Our weekly seminars are free to attend, in person or online.",
    showOn: ["seminars", "faq"],
  },
  {
    id: "seminar-length",
    group: "seminars",
    question: "How long is it?",
    answer: "About 60 to 90 minutes, including time for questions.",
    showOn: ["seminars", "faq"],
  },
  {
    id: "seminar-bring-someone",
    group: "seminars",
    question: "Can I bring someone?",
    answer: "Yes, please do. Ask them to register too, so we can save them a seat and send them reminders.",
    showOn: ["seminars", "faq"],
  },
  {
    id: "seminar-buy-anything",
    group: "seminars",
    question: "Do I have to buy anything?",
    answer: "No. We teach first. If you'd like to try a product afterwards, we'll help you choose, but there's no pressure.",
    showOn: ["seminars", "faq"],
  },
  {
    id: "seminar-cant-make-it",
    group: "seminars",
    question: "What if I can't make it?",
    answer: "Message us on WhatsApp and we'll send you a summary and the next date. You can also subscribe to our seminar calendar.",
    showOn: ["seminars", "faq"],
  },
  {
    id: "seminar-medical-advice",
    group: "seminars",
    question: "Is it medical advice?",
    answer: "No. Our seminars share general wellness information. For medical concerns, please see a doctor.",
    showOn: ["seminars", "faq"],
  },
  {
    id: "seminar-join-online",
    group: "seminars",
    question: "How do I join online?",
    answer: "After you register, we send the YouTube or Facebook Live link by WhatsApp and email before the start.",
    showOn: ["seminars", "faq"],
  },
];

const business: FaqItem[] = [
  {
    id: "business-experience",
    group: "business",
    question: "Do I need experience?",
    answer: "No. We train new distributors on products, ordering and customer care.",
    showOn: ["business", "faq"],
  },
  {
    id: "business-part-time",
    group: "business",
    question: "Can I do it part-time?",
    answer: "Many people start part-time. What you put in is up to you.",
    showOn: ["business", "faq"],
  },
  {
    id: "business-cost",
    group: "business",
    question: "How much does it cost to start?",
    answer:
      "Registration is through KEDI's official process, and costs depend on KEDI's current terms. We'll explain them clearly before you decide.",
    showOn: ["business", "faq"],
  },
  {
    id: "business-earnings",
    group: "business",
    question: "How much can I earn?",
    answer: "We don't promise any income. Earnings depend entirely on your own effort and sales and KEDI's official compensation plan.",
    showOn: ["business", "faq"],
  },
  {
    id: "business-recruiting",
    group: "business",
    question: "Do I have to recruit people?",
    answer: "No. You can focus on serving customers. Building a team is optional.",
    showOn: ["business", "faq"],
  },
  {
    id: "business-help-customers",
    group: "business",
    question: "Will you help me get customers?",
    answer: "We share our seminar and follow-up routines and invite your prospects to our seminars. Finding customers is still your work.",
    showOn: ["business", "faq"],
  },
];

export const faqItems: FaqItem[] = [...general, ...seminars, ...business];

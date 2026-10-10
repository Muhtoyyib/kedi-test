// The typed event catalogue — one member per row in
// docs/analytics-events.md. The doc is the source of truth; the analytics
// test parses it and asserts every row has a member here. Never add a param
// that could hold personal data (name, phone, address, free text).

export type WhatsAppLocation =
  | "header"
  | "mobile_menu"
  | "floating"
  | "footer"
  | "hero"
  | "final_cta"
  | "pdp_ask"
  | "out_of_stock"
  | "shop_no_results"
  | "shop_help"
  | "article_cta"
  | "story_cta"
  | "business"
  | "seminar_faq"
  | "faq"
  | "contact"
  | "about_cta"
  | "not_found";

export type SeminarLocation = "home_hero" | "home_banner" | "seminar_hero" | "upcoming_list" | "article_cta" | "business_invite";
export type CartLocation = "card" | "pdp" | "sticky_bar";
export type PhoneLocation = "mobile_menu" | "faq" | "contact" | "footer";
export type VideoLocation = "learn_hub" | "stories" | "article" | "seminar_highlights";
export type FormId = "contact" | "business_interest" | "referral_code" | "seminar_interest";

export type AnalyticsEvent =
  | {event: "view_item_list"; item_list_id: string; items: string[]}
  | {event: "select_item"; item_list_id: string; item_id: string}
  | {event: "view_item"; item_id: string; item_category: string; price?: number}
  | {event: "add_to_cart"; item_id: string; quantity: number; price?: number; location: CartLocation}
  | {event: "remove_from_cart"; item_id: string}
  | {event: "view_cart"; item_count: number; value: number}
  | {event: "begin_checkout"; item_count: number; value: number}
  | {event: "whatsapp_order_sent"; order_id: string; item_count: number; value: number; has_referral: boolean}
  | {event: "whatsapp_chat_click"; location: WhatsAppLocation; context?: string}
  | {event: "seminar_register_click"; seminar_id: string; location: SeminarLocation}
  | {event: "calendar_subscribe_click"}
  | {event: "form_submit"; form_id: FormId}
  | {event: "form_error"; form_id: FormId; reason: "validation" | "network" | "rate_limited" | "server"}
  | {event: "referral_code_created"}
  | {event: "referral_link_shared"; method: "whatsapp" | "copy" | "native_share"}
  | {event: "seminar_share"; method: "native_share" | "whatsapp"}
  | {event: "referral_landing"}
  | {event: "search"; search_term: string}
  | {event: "filter_category"; category: string}
  | {event: "video_play"; provider: string; location: VideoLocation}
  | {event: "article_read"; slug: string; topic: string}
  | {event: "phone_click"; location: PhoneLocation}
  | {event: "outbound_social"; network: string};

// Runtime mirror of the union's event names — the doc-coverage test checks
// every catalogue row maps to a member here, and this list's type guarantees
// the reverse direction.
export const ANALYTICS_EVENTS: readonly AnalyticsEvent["event"][] = [
  "view_item_list",
  "select_item",
  "view_item",
  "add_to_cart",
  "remove_from_cart",
  "view_cart",
  "begin_checkout",
  "whatsapp_order_sent",
  "whatsapp_chat_click",
  "seminar_register_click",
  "calendar_subscribe_click",
  "form_submit",
  "form_error",
  "referral_code_created",
  "referral_link_shared",
  "seminar_share",
  "referral_landing",
  "search",
  "filter_category",
  "video_play",
  "article_read",
  "phone_click",
  "outbound_social",
];

export interface MetaEvent {
  name: string;
  params?: Record<string, string | number | boolean | string[]>;
}

// Meta Pixel mapping (docs/analytics-events.md "Meta Pixel" column). Rows
// with "—" return null and forward to GA4 only.
export function toMetaEvent(e: AnalyticsEvent): MetaEvent | null {
  switch (e.event) {
    case "view_item":
      return {name: "ViewContent", params: {content_ids: [e.item_id], content_type: "product"}};
    case "add_to_cart":
      return {name: "AddToCart", params: e.price === undefined ? {} : {value: e.price, currency: "NGN"}};
    case "begin_checkout":
      return {name: "InitiateCheckout", params: {value: e.value, currency: "NGN"}};
    case "whatsapp_order_sent":
      return {name: "Lead", params: {content_category: "order", value: e.value, currency: "NGN"}};
    case "whatsapp_chat_click":
      return {name: "Contact"};
    case "seminar_register_click":
      return {name: "Lead", params: {content_category: "seminar"}};
    case "form_submit":
      return {name: "Lead", params: {content_category: e.form_id}};
    case "search":
      return {name: "Search", params: {search_string: e.search_term}};
    default:
      return null;
  }
}

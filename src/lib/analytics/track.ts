// Minimal typed event funnel for the primitives and shell. Change
// 07-add-analytics-and-seo replaces the union with the full event catalogue
// and adds the consent gate plus GA4/Meta forwarding.

export type AnalyticsEvent =
  | {event: "video_play"; provider: string; location: string}
  | {event: "whatsapp_chat_click"; location: string; context?: string}
  | {event: "phone_click"; location: string}
  | {event: "outbound_social"; network: string}
  | {event: "view_cart"};

export function track(_event: AnalyticsEvent): void {
  // No-op until 07 wires the consent gate and destinations.
}

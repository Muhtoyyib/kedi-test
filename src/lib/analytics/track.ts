// Minimal typed event funnel for the primitives built in 01. Change
// 07-add-analytics-and-seo replaces the union with the full event catalogue
// and adds the consent gate plus GA4/Meta forwarding.

export type AnalyticsEvent = {event: "video_play"; provider: string; location: string};

export function track(_event: AnalyticsEvent): void {
  // No-op until 07 wires the consent gate and destinations.
}

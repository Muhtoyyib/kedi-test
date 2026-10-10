import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {ANALYTICS_EVENTS, toMetaEvent} from "@/lib/analytics/events";
import {loadAnalytics, sendPageView} from "@/lib/analytics/loaders";
import {dropAnalyticsBuffer, markAnalyticsReady, resetAnalytics, track} from "@/lib/analytics/track";
import {captureAttribution, getAttribution, type Attribution} from "@/lib/attribution";
import type {StorageLike} from "@/lib/announcement";

// Docs tables: | `event_name` | … — every row (event catalogue + location
// table) must exist in the union list.
const doc = readFileSync(resolve(process.cwd(), "docs/analytics-events.md"), "utf8");
const docEvents = [...new Set([...doc.matchAll(/^\|\s*`([a-z_]+)`\s*\|/gm)].map((m) => m[1]))];

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v), removeItem: (k) => void map.delete(k)};
}

beforeEach(() => {
  resetAnalytics();
  delete window.gtag;
  delete window.fbq;
  document.head.innerHTML = "";
  vi.useRealTimers();
});

describe("event catalogue", () => {
  it("covers every event row in docs/analytics-events.md", () => {
    for (const name of docEvents) {
      expect(ANALYTICS_EVENTS, `missing union member for ${name}`).toContain(name);
    }
    expect(ANALYTICS_EVENTS.length).toBe(docEvents.length);
  });
});

describe("track", () => {
  it("buffers pre-consent events and flushes them after load", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    track({event: "add_to_cart", item_id: "KD-1", quantity: 1, price: 5000, location: "card"});
    expect(gtag).not.toHaveBeenCalled();
    markAnalyticsReady();
    expect(gtag).toHaveBeenCalledWith("event", "add_to_cart", expect.objectContaining({item_id: "KD-1"}));
  });

  it("drops the buffer on decline", () => {
    window.gtag = vi.fn();
    track({event: "referral_landing"});
    dropAnalyticsBuffer();
    markAnalyticsReady();
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("caps the buffer at 20 events", () => {
    window.gtag = vi.fn();
    for (let i = 0; i < 25; i++) track({event: "referral_landing"});
    markAnalyticsReady();
    expect(window.gtag).toHaveBeenCalledTimes(20);
  });

  it("forwards mapped events to the Meta Pixel", () => {
    window.gtag = vi.fn();
    const fbq = vi.fn();
    window.fbq = fbq;
    markAnalyticsReady();
    track({event: "whatsapp_order_sent", order_id: "KD-1-2", item_count: 2, value: 12000, has_referral: false});
    expect(fbq).toHaveBeenCalledWith("track", "Lead", expect.objectContaining({content_category: "order"}));
    track({event: "referral_landing"});
    expect(fbq).toHaveBeenCalledTimes(1);
  });
});

describe("toMetaEvent", () => {
  it("maps the documented rows and returns null otherwise", () => {
    expect(toMetaEvent({event: "view_item", item_id: "p1", item_category: "c"})?.name).toBe("ViewContent");
    expect(toMetaEvent({event: "whatsapp_chat_click", location: "header"})?.name).toBe("Contact");
    expect(toMetaEvent({event: "phone_click", location: "footer"})).toBeNull();
  });
});

describe("loaders", () => {
  it("injects GA4 and fires manual page views only after load", () => {
    vi.useFakeTimers();
    loadAnalytics({ga4: "G-TEST"});
    vi.advanceTimersByTime(2000);
    expect(document.head.querySelector('script[src*="googletagmanager"]')).not.toBeNull();
    expect(window.gtag).toBeDefined();
    sendPageView("/shop", "Shop");
    expect(window.dataLayer?.some((args) => args[0] === "event" && args[1] === "page_view")).toBe(true);
  });

  it("loads nothing for missing IDs but still marks ready", () => {
    vi.useFakeTimers();
    loadAnalytics({});
    vi.advanceTimersByTime(2000);
    expect(document.head.querySelector("script")).toBeNull();
    // Buffered events flush via the (absent) tags without errors.
    expect(() => track({event: "referral_landing"})).not.toThrow();
  });
});

describe("attribution", () => {
  const NOW = 1_700_000_000_000;

  it("captures the first utm-carrying landing of the session", () => {
    const s = memoryStorage();
    const att = captureAttribution("https://x.test/shop?utm_source=instagram&utm_campaign=seminar-oct", s, NOW);
    expect(att).toMatchObject({source: "instagram", campaign: "seminar-oct", landing_path: "/shop"});
    const second = captureAttribution("https://x.test/?utm_source=facebook", s, NOW + 1);
    expect(second?.source).toBe("instagram");
    expect(getAttribution(s)?.campaign).toBe("seminar-oct");
  });

  it("stores nothing without campaign parameters", () => {
    const s = memoryStorage();
    expect(captureAttribution("https://x.test/", s, NOW)).toBeNull();
    expect(getAttribution(s)).toBeNull();
  });

  it("tolerates corrupt storage", () => {
    const s = memoryStorage();
    s.setItem("attribution:v1", "{bad");
    expect(getAttribution(s)).toBeNull();
    expect((captureAttribution("https://x.test/?utm_source=ig", s, NOW) as Attribution | null)?.source).toBe("ig");
  });
});

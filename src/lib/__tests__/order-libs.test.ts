import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {catalog} from "@/lib/catalog/data";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {selectLines} from "@/lib/cart/selectors";
import type {Cart} from "@/lib/cart/types";
import {sendOrder} from "@/lib/order/beacon";
import {emptyDetails, loadDetails, saveDetails, validateDetails, type OrderDetails, OTHER_AREA} from "@/lib/order/details";
import {createOrderId} from "@/lib/order/order-id";
import {areaText, buildOrderPayload} from "@/lib/order/payload";
import {cartHash, readPending, savePending} from "@/lib/order/pending";
import {sendOrderViaWhatsApp} from "@/lib/order/send-order";
import {siteConfig} from "@/lib/site-config";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {orderMessage} from "@/lib/whatsapp/messages";

const cartOf = (...lines: [string, number][]): Cart => ({version: 1, lines: lines.map(([productId, qty]) => ({productId, qty}))});
const valid: OrderDetails = {...emptyDetails, name: "Ngozi Adeyemi", phone: "0803 123 4567", area: "Fixture Ikeja"};

beforeEach(() => {
  resetAnalytics();
  window.localStorage.clear();
  window.sessionStorage.clear();
});

describe("createOrderId", () => {
  const random = () => new Uint32Array([0, 5, 9, 27]);

  it("matches KD-YYMMDD-XXXX with no ambiguous characters", () => {
    const id = createOrderId(new Date("2026-10-13T12:00:00Z"), random);
    expect(id).toMatch(/^KD-\d{6}-[2-9A-HJKMNPQRSTV-Z]{4}$/);
    expect(id.slice(-4)).not.toMatch(/[01ILOU]/);
    expect(id.endsWith("-27BX")).toBe(true); // alphabet indices 0,5,9,27
  });

  it("uses the Africa/Lagos calendar day (23:30 UTC → next day)", () => {
    expect(createOrderId(new Date("2026-10-12T23:30:00Z"), random)).toMatch(/^KD-261013-/);
  });
});

describe("orderMessage", () => {
  it("formats the exact order message (docs/whatsapp-messages.md §1)", () => {
    const lines = selectLines(cartOf(["KD-F001", 2], ["KD-F003", 1]), catalog);
    const message = orderMessage({
      orderId: "KD-261012-7F3K",
      lines,
      subtotalNgn: 59000,
      hasAskPrice: false,
      customerName: "Ngozi Adeyemi",
      areaText: "Fixture Ikeja",
      referralCode: "AMAKA-4821",
    });
    expect(message).toBe(
      `Hello ${siteConfig.name}! I'd like to place an order.\n\nOrder ID: KD-261012-7F3K\n• Fixture Digestive Tea × 2 — ₦37,000\n• Fixture Energy Capsules × 1 — ₦22,000\nSubtotal: ₦59,000 (delivery fee to be confirmed)\n\nName: Ngozi Adeyemi\nDelivery area: Fixture Ikeja\nReferral code: AMAKA-4821`
    );
  });

  it("marks ask-price lines and the subtotal as 'to confirm'", () => {
    const lines = selectLines(cartOf(["KD-F002", 1], ["KD-F003", 1]), catalog);
    const message = orderMessage({
      orderId: "X",
      lines,
      subtotalNgn: 22000,
      hasAskPrice: true,
      customerName: "A",
      areaText: "B",
      referralCode: "",
    });
    expect(message).toContain("• Fixture Colon Cleanser × 1 — price to confirm");
    expect(message).toContain("Subtotal: ₦22,000 + items to confirm");
    expect(message).not.toContain("Referral code");
  });
});

describe("buildWhatsAppLink", () => {
  it("builds a wa.me link whose text round-trips and stays under 2,000 chars for a full cart", () => {
    const lines = selectLines(cartOf(...catalog.products.slice(0, 9).map((p) => [p.id, 2] as [string, number])), catalog);
    const link = buildWhatsAppLink(
      orderMessage({orderId: "KD-1", lines, subtotalNgn: 0, hasAskPrice: true, customerName: "N", areaText: "A", referralCode: ""})
    );
    expect(link).toMatch(/^https:\/\/wa\.me\//);
    expect(decodeURIComponent(new URL(link).searchParams.get("text")!)).toContain("Order ID: KD-1");
    expect(link.length).toBeLessThan(2000);
  });
});

describe("validateDetails", () => {
  it("reports every field error with the exact copy", () => {
    const {errors} = validateDetails({...emptyDetails, name: " ", phone: "123", referralCode: "bad"});
    expect(errors).toEqual({
      name: "Enter your name so we know who's ordering",
      phone: "Enter a Nigerian mobile number, e.g. 0803 123 4567",
      area: "Choose where we should deliver",
      referralCode: "This code doesn't look right. Check it or leave it empty.",
    });
  });

  it("requires the free-text area only when 'Other' is chosen", () => {
    expect(validateDetails({...valid, area: OTHER_AREA, areaOther: " "}).errors.areaOther).toBe("Tell us your area");
    expect(validateDetails({...valid, area: OTHER_AREA, areaOther: "Magodo"}).errors.areaOther).toBeUndefined();
    expect(validateDetails(valid).errors).toEqual({});
  });

  it("normalises the phone to E.164 and persists remembered fields", () => {
    expect(validateDetails(valid).phoneE164).toBe("+2348031234567");
    saveDetails({name: "Ngozi", phone: "0803", area: "Ikeja", areaOther: ""});
    expect(loadDetails()).toEqual({name: "Ngozi", phone: "0803", area: "Ikeja", areaOther: ""});
  });
});

describe("payload + pending", () => {
  it("builds the Apps Script payload with the area text used in the message", () => {
    const lines = selectLines(cartOf(["KD-F001", 1]), catalog);
    const details = {...valid, area: OTHER_AREA, areaOther: "Magodo", referralCode: " AMAKA-4821 ", followupConsent: true};
    const payload = buildOrderPayload({
      lines,
      details,
      phoneE164: "+2348031234567",
      context: {page: "/shop", attribution: null},
      orderId: "KD-1",
    });
    expect(payload).toMatchObject({
      orderId: "KD-1",
      phone: "+2348031234567",
      area: "Other — Magodo",
      items: [{productId: "KD-F001", qty: 1}],
      subtotal: 18500,
      referralCode: "AMAKA-4821",
      followupConsent: true,
      utm: {source: "", medium: "", campaign: ""},
      page: "/shop",
    });
    expect(areaText(details)).toBe("Other — Magodo");
    expect(areaText(valid)).toBe("Fixture Ikeja");
  });

  it("round-trips pending markers, expires after 24h and hashes the cart", () => {
    const at = Date.now();
    savePending({orderId: "KD-1", at, cartHash: "a:1", message: "m"});
    expect(readPending(at + 1000)?.orderId).toBe("KD-1");
    expect(readPending(at + 25 * 60 * 60 * 1000)).toBeNull();
    expect(
      cartHash([
        {productId: "a", qty: 1},
        {productId: "b", qty: 2},
      ])
    ).toBe("a:1,b:2");
  });
});

describe("sendOrder beacon", () => {
  const payload = buildOrderPayload({
    lines: [],
    details: valid,
    phoneE164: "+2348031234567",
    context: {page: "/", attribution: null},
    orderId: "KD-1",
  });

  it("uses sendBeacon, falls back to keepalive fetch, and reports unavailable", () => {
    const beacon = vi.fn(() => true);
    vi.stubGlobal("navigator", {...navigator, sendBeacon: beacon});
    expect(sendOrder(payload, "", "https://x.test")).toBe("queued");
    expect(beacon).toHaveBeenCalledOnce();

    vi.stubGlobal("navigator", {...navigator, sendBeacon: () => false});
    const fetchSpy = vi.fn(() => Promise.resolve(new Response()));
    vi.stubGlobal("fetch", fetchSpy);
    expect(sendOrder(payload, "", "https://x.test")).toBe("queued");
    expect(fetchSpy).toHaveBeenCalledWith("https://x.test", expect.objectContaining({keepalive: true}));

    vi.stubGlobal("fetch", () => Promise.reject(new Error("offline")));
    expect(sendOrder(payload, "", "")).toBe("unavailable");
    vi.unstubAllGlobals();
  });
});

describe("sendOrderViaWhatsApp", () => {
  const lines = () => selectLines(cartOf(["KD-F001", 2]), catalog);

  it("blocks on invalid details without opening WhatsApp", () => {
    const open = vi.fn();
    const result = sendOrderViaWhatsApp({details: emptyDetails, lines: lines(), page: "/", open});
    expect(result.ok).toBe(false);
    expect(open).not.toHaveBeenCalled();
  });

  it("sends: order ID, pending marker, saved details, tracking, then opens the link", () => {
    markAnalyticsReady();
    window.gtag = vi.fn();
    const open = vi.fn();
    const result = sendOrderViaWhatsApp({details: valid, lines: lines(), page: "/", now: new Date("2026-10-13T12:00:00Z"), open});
    expect(result.ok).toBe(true);
    const link = open.mock.calls[0][0] as string;
    const orderId = decodeURIComponent(new URL(link).searchParams.get("text")!).match(/Order ID: (KD-\d{6}-[2-9A-HJKMNPQRSTV-Z]{4})/)![1];
    expect(readPending()?.orderId).toBe(orderId);
    expect(loadDetails()?.name).toBe("Ngozi Adeyemi");
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "whatsapp_order_sent",
      expect.objectContaining({order_id: orderId, item_count: 2, value: 37000})
    );
  });
});

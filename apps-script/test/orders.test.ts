import {describe, expect, it} from "vitest";
import {applyOrderStatus, parseOrderPayload, recordOrder, reorderDueDates, type OrderPayload} from "../src/orders.ts";
import {TABS} from "../src/schema.ts";
import {str} from "../src/table.ts";
import {MemoryStore, seedCatalog} from "./fakes.ts";

const NOW = new Date("2026-10-09T08:00:00Z");
const TODAY = "2026-10-09";

const orderPayload = (over: Partial<OrderPayload> = {}): OrderPayload => ({
  orderId: "KD-261009-AAAA",
  customerName: "Amaka Obi",
  phone: "+2348031234567",
  area: "Ikeja",
  items: [{productId: "KD-P001", qty: 2}],
  subtotal: 37000,
  referralCode: "",
  followupConsent: false,
  utm: {source: "", medium: "", campaign: ""},
  page: "/cart",
  ...over,
});

describe("parseOrderPayload", () => {
  it("accepts a valid payload and normalises the phone", () => {
    const p = parseOrderPayload({...orderPayload(), phone: "0803 123 4567"});
    expect(p?.phone).toBe("+2348031234567");
  });

  it.each([
    [{phone: "01 234 5678"}, "landline"],
    [{items: []}, "empty items"],
    [{items: Array(21).fill({productId: "KD-P001", qty: 1})}, "over 20 lines"],
    [{items: [{productId: "KD-P001", qty: 0}]}, "qty 0"],
    [{items: [{productId: "KD-P001", qty: 25}]}, "qty over 20"],
    [{customerName: ""}, "missing name"],
  ])("rejects %s", (patch: Record<string, unknown>, _label: string) => {
    expect(parseOrderPayload({...orderPayload(), ...patch})).toBeNull();
  });
});

describe("recordOrder", () => {
  it("records the order once even on a double tap", () => {
    const store = new MemoryStore(seedCatalog());
    recordOrder(store, orderPayload(), NOW);
    const again = recordOrder(store, orderPayload(), NOW);
    expect(again).toEqual({ok: true, id: "KD-261009-AAAA", code: "duplicate"});
    expect(store.table(TABS.orders).rows).toHaveLength(1);
  });

  it("recomputes the subtotal and flags a mismatch", () => {
    const store = new MemoryStore(seedCatalog());
    recordOrder(store, orderPayload({subtotal: 99999}), NOW);
    const row = store.table(TABS.orders).rows[0];
    expect(row.rec.computed_subtotal_ngn).toBe(37000);
    expect(row.rec.price_mismatch).toBe("Yes");
  });

  it("marks orders containing ask-price products and skips the mismatch check", () => {
    const seed = seedCatalog();
    seed.products![0].price_ngn = "";
    const store = new MemoryStore(seed);
    recordOrder(store, orderPayload({subtotal: 123}), NOW);
    const row = store.table(TABS.orders).rows[0];
    expect(row.rec.price_mismatch).toBe("No");
    expect(str(row.rec.notes)).toBe("has_ask_price");
  });

  it("creates a new customer with status Contacted", () => {
    const store = new MemoryStore(seedCatalog());
    recordOrder(store, orderPayload(), NOW);
    const lead = store.table(TABS.leads).rows[0];
    expect(lead.rec.status).toBe("Contacted");
    expect(lead.rec.source).toBe("website_order");
  });

  it("does not downgrade a Repeat Customer", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      leads: [{phone: "+2348031234567", name: "Amaka Obi", status: "Repeat Customer", date_added: "2026-01-01"}],
    });
    recordOrder(store, orderPayload(), NOW);
    expect(store.table(TABS.leads).rows[0].rec.status).toBe("Repeat Customer");
  });

  it("links a referral code to the order", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      referrals: [
        {
          code: "AMAKA-4821",
          referrer_name: "Amaka",
          referrer_phone: "+2349011111111",
          created_at: "2026-10-01",
          reward_status: "Pending",
          duplicate_flag: "No",
        },
      ],
    });
    recordOrder(store, orderPayload({referralCode: "amaka-4821"}), NOW);
    const ref = store.table(TABS.referrals).rows[0];
    expect(ref.rec.referred_phone).toBe("+2348031234567");
    expect(ref.rec.first_order_id).toBe("KD-261009-AAAA");
  });
});

describe("reorderDueDates", () => {
  it("computes day-3, day-14 and pack-minus-5 dates", () => {
    expect(reorderDueDates("2026-10-01", 30, 1)).toEqual({due: "2026-10-26", day3: "2026-10-04", day14: "2026-10-15"});
  });
});

describe("applyOrderStatus", () => {
  const deliveredOrder = (store: MemoryStore) => {
    recordOrder(store, orderPayload(), NOW);
    return store.table(TABS.orders).rows[0].row;
  };

  it("marks a delivered order and schedules queue rows", () => {
    const store = new MemoryStore(seedCatalog());
    const row = deliveredOrder(store);
    applyOrderStatus(store, row, "Delivered", TODAY);
    const queue = store.table(TABS.reorder).rows;
    expect(queue).toHaveLength(1);
    expect(queue[0].rec.pack_days).toBe(30);
    expect(queue[0].rec.qty).toBe(2);
    expect(String(queue[0].rec.due_date)).toContain("$D");
    expect(store.table(TABS.orders).rows[0].rec.delivered_at).toBe(TODAY);
  });

  it("bumps the customer to Customer on first paid order and sets reward due", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      leads: [
        {phone: "+2348031234567", name: "Amaka", status: "Contacted", order_count: 0},
        {phone: "+2349011111111", name: "Chidi", status: "Customer", order_count: 3},
      ],
      referrals: [
        {
          code: "CHIDI-1111",
          referrer_name: "Chidi",
          referrer_phone: "+2349011111111",
          created_at: "2026-10-01",
          referred_phone: "+2348031234567",
          first_order_id: "KD-261009-AAAA",
          reward_status: "Pending",
        },
      ],
    });
    recordOrder(store, orderPayload({referralCode: "CHIDI-1111"}), NOW);
    const row = store.table(TABS.orders).rows[0].row;
    applyOrderStatus(store, row, "Paid", TODAY);
    const leads = store.table(TABS.leads).rows;
    expect(leads[0].rec.status).toBe("Customer");
    expect(leads[0].rec.order_count).toBe(1);
    expect(leads[1].rec.status).toBe("Referrer");
    expect(store.table(TABS.referrals).rows[0].rec.reward_status).toBe("Due");
  });

  it("second paid order → Repeat Customer", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      leads: [{phone: "+2348031234567", name: "Amaka", status: "Customer", order_count: 1}],
    });
    const row = deliveredOrder(store);
    applyOrderStatus(store, row, "Paid", TODAY);
    expect(store.table(TABS.leads).rows[0].rec.status).toBe("Repeat Customer");
  });

  it("cancel removes pending queue rows for the order", () => {
    const store = new MemoryStore(seedCatalog());
    const row = deliveredOrder(store);
    applyOrderStatus(store, row, "Delivered", TODAY);
    applyOrderStatus(store, row, "Cancelled", TODAY);
    expect(store.table(TABS.reorder).rows).toHaveLength(0);
  });
});

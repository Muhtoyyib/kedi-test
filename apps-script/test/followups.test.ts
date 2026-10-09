import {describe, expect, it} from "vitest";
import {collectTodo, todoEmailHtml, todoSubject} from "../src/followups.ts";
import {TABS} from "../src/schema.ts";
import {MemoryStore, seedCatalog} from "./fakes.ts";

const NOW = new Date(2026, 9, 10, 7); // 10 Oct, 07:00 local
const CTX = {brand: "Test Brand", rewardText: "a free gift"};

const collect = (store: MemoryStore) => collectTodo(store, NOW, CTX);
const section = (store: MemoryStore, key: string) => collect(store).find((s) => s.key === key)?.items ?? [];

describe("collectTodo", () => {
  it("lists website orders created before today that aren't confirmed", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      orders: [
        {
          order_id: "KD-1",
          phone: "+2348031234567",
          customer_name: "Amaka Obi",
          items_text: "Product A x1",
          status: "Started on website",
          created_at: "2026-10-09",
        },
        {
          order_id: "KD-2",
          phone: "+2348011111111",
          customer_name: "Bola",
          items_text: "x",
          status: "Started on website",
          created_at: "2026-10-10",
        },
      ],
    });
    const items = section(store, "abandoned");
    expect(items.map((i) => i.name)).toEqual(["Amaka Obi"]);
    expect(items[0].message).toContain("KD-1");
    expect(items[0].phone).toBe("+2348031234567");
  });

  it("lists orders awaiting payment", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      orders: [
        {
          order_id: "KD-2",
          phone: "+2348011111111",
          customer_name: "Bola",
          items_text: "x",
          status: "Awaiting Payment",
          created_at: "2026-10-08",
        },
      ],
    });
    expect(section(store, "unpaid").map((i) => i.name)).toEqual(["Bola"]);
  });

  it("computes reorder + check-in dates from delivered_at", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      reorder: [
        // reorder due today: 2026-09-15 + 30*1 - 5; earlier check-ins already sent
        {
          order_id: "KD-9",
          phone: "+2348022222222",
          product_id: "KD-P001",
          delivered_at: "2026-09-15",
          pack_days: 30,
          qty: 1,
          day3_sent: "Yes",
          day14_sent: "Yes",
        },
        // day-3 due today: 2026-10-07 + 3
        {order_id: "KD-9", phone: "+2348022222222", product_id: "KD-P001", delivered_at: "2026-10-07", pack_days: 30, qty: 1},
        // day-14 due today: 2026-09-26 + 14; day-3 already sent
        {
          order_id: "KD-9",
          phone: "+2348022222222",
          product_id: "KD-P001",
          delivered_at: "2026-09-26",
          pack_days: 30,
          qty: 1,
          day3_sent: "Yes",
        },
        // nothing due yet (delivered 2 days ago — day-3 is tomorrow)
        {order_id: "KD-9", phone: "+2348022222222", product_id: "KD-P001", delivered_at: "2026-10-08", pack_days: 30, qty: 1},
        // everything sent
        {
          order_id: "KD-9",
          phone: "+2348022222222",
          product_id: "KD-P001",
          delivered_at: "2026-09-10",
          pack_days: 30,
          qty: 1,
          day3_sent: "Yes",
          day14_sent: "Yes",
          reorder_sent: "Yes",
        },
      ],
    });
    expect(section(store, "reorders")).toHaveLength(1);
    expect(section(store, "day3")).toHaveLength(1);
    expect(section(store, "day14")).toHaveLength(1);
  });

  it("lists leads with status New Lead added before today", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      leads: [
        {phone: "+2348031234567", name: "Fresh Lead", status: "New Lead", date_added: "2026-10-09"},
        {phone: "+2348044444444", name: "Today", status: "New Lead", date_added: "2026-10-10"},
      ],
    });
    expect(section(store, "new-leads").map((i) => i.name)).toEqual(["Fresh Lead"]);
  });

  it("win-back: 60+ quiet days → listed and marked Inactive", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      leads: [{phone: "+2348031234567", name: "Stale One", status: "Customer", last_order_at: "2026-07-15"}],
    });
    expect(section(store, "winback").map((i) => i.name)).toEqual(["Stale One"]);
    expect(store.table(TABS.leads).rows[0].rec.status).toBe("Inactive");
  });

  it("surfaces Due referral rewards and duplicate codes", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      referrals: [
        {
          code: "Y-2",
          referrer_name: "Chidi",
          referrer_phone: "+2348066666666",
          created_at: "2026-10-01",
          reward_status: "Due",
          duplicate_flag: "No",
        },
        {
          code: "X-1",
          referrer_name: "Fake",
          referrer_phone: "+2348055555555",
          created_at: "2026-10-09",
          reward_status: "Pending",
          duplicate_flag: "Yes",
        },
      ],
    });
    expect(section(store, "rewards").map((i) => i.name)).toEqual(["Chidi"]);
    expect(section(store, "rewards")[0].message).toContain("a free gift");
    expect(section(store, "dupes")[0].meta).toContain("X-1");
  });
});

describe("todoEmailHtml / todoSubject", () => {
  it("renders a wa.me button per item", () => {
    const store = new MemoryStore({
      ...seedCatalog(),
      orders: [
        {
          order_id: "KD-1",
          phone: "+2348031234567",
          customer_name: "Amaka",
          items_text: "x",
          status: "Started on website",
          created_at: "2026-10-09",
        },
      ],
    });
    const html = todoEmailHtml(collect(store), CTX.brand);
    expect(html).toContain("wa.me/2348031234567");
    expect(html).toContain("Amaka");
    expect(todoSubject(collect(store), CTX.brand)).toBe("Test Brand — today's follow-ups (1)");
  });

  it("says nothing due when every section is empty", () => {
    const html = todoEmailHtml(collect(new MemoryStore(seedCatalog())), CTX.brand);
    expect(html).toContain("Nothing due today");
  });
});

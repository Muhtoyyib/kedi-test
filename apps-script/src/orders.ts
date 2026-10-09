// Order intake (design §2) and the status transitions that fire when the
// distributor edits Orders.status (design §3). Pure over Store — tested in
// Node with MemoryStore.

import {normalizeNigerianPhone} from "./phone.ts";
import {TABS} from "./schema.ts";
import type {Store} from "./store.ts";
import {addDays, findRow, num, str, toDateStr, yn, type Cell} from "./table.ts";

export interface OrderLine {
  productId: string;
  qty: number;
}

export interface OrderPayload {
  orderId: string;
  customerName: string;
  phone: string; // normalised E.164
  area: string;
  items: OrderLine[];
  subtotal: number;
  referralCode: string;
  followupConsent: boolean;
  utm: {source: string; medium: string; campaign: string};
  page: string;
}

const MAX_FIELD = 500;
const MAX_LINES = 20;
const MAX_QTY = 20;

/** Validate the untrusted browser payload. Returns null when anything is off. */
export function parseOrderPayload(raw: unknown): OrderPayload | null {
  if (typeof raw !== "object" || raw === null) return null;
  const p = raw as Record<string, unknown>;
  const phone = normalizeNigerianPhone(str(p.phone as Cell));
  const items = parseItems(p.items);
  if (!phone || !items) return null;
  if (!str(p.orderId as Cell) || str(p.orderId as Cell).length > 60) return null;
  if (!str(p.customerName as Cell) || str(p.customerName as Cell).length > MAX_FIELD) return null;
  if (str(p.area as Cell).length > MAX_FIELD) return null;
  const subtotal = typeof p.subtotal === "number" ? p.subtotal : Number(str(p.subtotal as Cell));
  if (!Number.isFinite(subtotal) || subtotal < 0) return null;
  const utm = (typeof p.utm === "object" && p.utm !== null ? p.utm : {}) as Record<string, unknown>;
  return {
    orderId: str(p.orderId as Cell),
    customerName: str(p.customerName as Cell),
    phone,
    area: str(p.area as Cell),
    items,
    subtotal,
    referralCode: str(p.referralCode as Cell).slice(0, 60),
    followupConsent: p.followupConsent === true,
    utm: {
      source: str(utm.source as Cell).slice(0, 100),
      medium: str(utm.medium as Cell).slice(0, 100),
      campaign: str(utm.campaign as Cell).slice(0, 100),
    },
    page: str(p.page as Cell).slice(0, 200),
  };
}

function parseItems(raw: unknown): OrderLine[] | null {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > MAX_LINES) return null;
  const items: OrderLine[] = [];
  for (const line of raw) {
    if (typeof line !== "object" || line === null) return null;
    const {productId, qty} = line as Record<string, unknown>;
    const id = str(productId as Cell);
    const q = typeof qty === "number" ? qty : Number(str(qty as Cell));
    if (!id || id.length > 60 || !Number.isInteger(q) || q < 1 || q > MAX_QTY) return null;
    items.push({productId: id, qty: q});
  }
  return items;
}

export type OrderResult = {ok: true; id: string; code?: "duplicate"} | {ok: false; code: "invalid_payload"};

/**
 * Append an order exactly once, recompute the subtotal from Products, flag a
 * mismatch, upsert the customer and link a referral code if there is one.
 */
export function recordOrder(store: Store, payload: OrderPayload, now: Date): OrderResult {
  const orders = store.table(TABS.orders);
  if (findRow(orders, "order_id", payload.orderId)) return {ok: true, id: payload.orderId, code: "duplicate"};

  const products = store.table(TABS.products);
  let computed = 0;
  let hasAskPrice = false;
  const names: string[] = [];
  for (const line of payload.items) {
    const row = findRow(products, "product_id", line.productId);
    const price = row ? num(row.rec.price_ngn) : null;
    names.push(`${row ? str(row.rec.name) : line.productId} × ${line.qty}`);
    if (price === null) hasAskPrice = true;
    else computed += price * line.qty;
  }

  const today = toDateStr(now);
  store.append(TABS.orders, {
    order_id: payload.orderId,
    created_at: now,
    customer_name: payload.customerName,
    phone: payload.phone,
    area: payload.area,
    items_json: JSON.stringify(payload.items),
    items_text: names.join("; "),
    subtotal_ngn: payload.subtotal,
    computed_subtotal_ngn: computed,
    price_mismatch: !hasAskPrice && computed !== payload.subtotal ? "Yes" : "No",
    referral_code: payload.referralCode,
    followup_consent: payload.followupConsent ? "Yes" : "No",
    status: "Started on website",
    utm_source: payload.utm.source,
    utm_medium: payload.utm.medium,
    utm_campaign: payload.utm.campaign,
    page: payload.page,
    notes: hasAskPrice ? "has_ask_price" : "",
  });
  upsertCustomer(store, payload, today);
  if (payload.referralCode) linkReferral(store, payload);
  return {ok: true, id: payload.orderId};
}

const KEPT_STATUSES = ["Customer", "Repeat Customer", "Referrer"];

export function upsertCustomer(store: Store, payload: OrderPayload, today: string): void {
  const leads = store.table(TABS.leads);
  const existing = findRow(leads, "phone", payload.phone);
  const consent: Record<string, Cell> = payload.followupConsent ? {consent: "Yes", consent_at: today} : {};
  if (!existing) {
    store.append(TABS.leads, {
      phone: payload.phone,
      name: payload.customerName,
      area: payload.area,
      source: "website_order",
      status: "Contacted",
      business_interest: "No",
      consent: payload.followupConsent ? "Yes" : "No",
      consent_at: payload.followupConsent ? today : "",
      date_added: today,
      last_contact: today,
      order_count: 0,
    });
    return;
  }
  const patch: Record<string, Cell> = {last_contact: today, ...consent};
  if (!str(existing.rec.name)) patch.name = payload.customerName;
  if (!str(existing.rec.area)) patch.area = payload.area;
  if (!KEPT_STATUSES.includes(str(existing.rec.status))) patch.status = "Contacted";
  store.patch(TABS.leads, existing.row, patch);
}

/** Order carries a referral code → mark the first unclaimed code row as used. */
function linkReferral(store: Store, payload: OrderPayload): void {
  const referrals = store.table(TABS.referrals);
  const match = referrals.rows.find(
    (r) => str(r.rec.code).toUpperCase() === payload.referralCode.toUpperCase() && !str(r.rec.referred_phone)
  );
  if (match) store.patch(TABS.referrals, match.row, {referred_phone: payload.phone, first_order_id: payload.orderId});
}

// ── Status transitions (design §3) ──────────────────────────────────────────

/** Pure: the three queue dates for a delivered order line. */
export function reorderDueDates(delivered: string, packDays: number, qty: number): {due: string; day3: string; day14: string} {
  return {due: addDays(delivered, packDays * qty - 5), day3: addDays(delivered, 3), day14: addDays(delivered, 14)};
}

export function applyOrderStatus(store: Store, orderRowNumber: number, newStatus: string, today: string): void {
  const order = store.table(TABS.orders).rows.find((r) => r.row === orderRowNumber);
  if (!order) return;
  const lead = findRow(store.table(TABS.leads), "phone", str(order.rec.phone));
  if (newStatus === "Paid") onPaid(store, order.rec, lead, today);
  else if (newStatus === "Delivered") onDelivered(store, orderRowNumber, order.rec, today);
  else if (newStatus === "Cancelled") onCancelled(store, str(order.rec.order_id));
}

function onPaid(store: Store, order: Record<string, Cell>, lead: ReturnType<typeof findRow>, today: string): void {
  if (!lead) return;
  const count = (num(lead.rec.order_count) ?? 0) + 1;
  store.patch(TABS.leads, lead.row, {
    order_count: count,
    last_order_at: today,
    status: count >= 2 ? "Repeat Customer" : "Customer",
  });
  const code = str(order.referral_code);
  if (!code || count !== 1) return;
  const referrals = store.table(TABS.referrals);
  const used = referrals.rows.find(
    (r) => str(r.rec.code).toUpperCase() === code.toUpperCase() && str(r.rec.referred_phone) === str(order.phone)
  );
  if (!used) return;
  store.patch(TABS.referrals, used.row, {reward_status: "Due"});
  const referrer = findRow(store.table(TABS.leads), "phone", str(used.rec.referrer_phone));
  if (referrer) store.patch(TABS.leads, referrer.row, {status: "Referrer"});
}

function onDelivered(store: Store, orderRow: number, order: Record<string, Cell>, today: string): void {
  store.patch(TABS.orders, orderRow, {delivered_at: today});
  const items = parseItems(JSON.parse(str(order.items_json) || "[]")) ?? [];
  const products = store.table(TABS.products);
  for (const line of items) {
    const product = findRow(products, "product_id", line.productId);
    const packDays = product ? (num(product.rec.pack_days) ?? 30) : 30;
    const row = store.append(TABS.reorder, {
      order_id: str(order.order_id),
      phone: str(order.phone),
      product_id: line.productId,
      delivered_at: today,
      pack_days: packDays,
      qty: line.qty,
    });
    // Formula columns: due = delivered + pack_days*qty − 5; check-ins +3/+14.
    // Follow-up selection recomputes them, so tests never depend on formulas.
    store.patch(TABS.reorder, row, {
      due_date: `=$D${row}+$E${row}*$F${row}-5`,
      day3_due: `=$D${row}+3`,
      day14_due: `=$D${row}+14`,
    });
  }
}

function onCancelled(store: Store, orderId: string): void {
  const queue = store.table(TABS.reorder);
  const pending = queue.rows
    .filter((r) => str(r.rec.order_id) === orderId && !yn(r.rec.day3_sent) && !yn(r.rec.day14_sent) && !yn(r.rec.reorder_sent))
    .map((r) => r.row);
  if (pending.length) store.removeRows(TABS.reorder, pending);
}

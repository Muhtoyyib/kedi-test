// Daily to-do email (design §4). `collectTodo` decides which rows appear and
// applies its one mutation (60-day win-backs are flagged Inactive). The HTML
// builder and the MailApp sender are thin wrappers around it.

import {reorderDueDates} from "./orders.ts";
import {TABS} from "./schema.ts";
import type {Store} from "./store.ts";
import {daysBetween, dateOnly, findRow, num, str, toDateStr, yn, type Cell} from "./table.ts";

export interface TodoEntry {
  name: string;
  phone: string; // E.164 for display; wa.me digits derived in the link
  message: string;
  meta?: string;
}

export interface TodoSection {
  key: string;
  title: string;
  items: TodoEntry[];
}

export interface TodoContext {
  brand: string;
  rewardText: string;
}

function firstName(name: string): string {
  return str(name).split(/\s+/)[0] || "there";
}

function wa(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/^\+/, "")}?text=${encodeURIComponent(message)}`;
}

/** Collect the nine to-do sections (design §4). `now` is WAT. */
export function collectTodo(store: Store, now: Date, ctx: TodoContext): TodoSection[] {
  const today = toDateStr(now);
  const leads = store.table(TABS.leads);
  const orders = store.table(TABS.orders);
  const queue = store.table(TABS.reorder);
  const referrals = store.table(TABS.referrals);
  const products = store.table(TABS.products);
  const leadName = (phone: string) => firstName(str(findRow(leads, "phone", phone)?.rec.name ?? null));
  const productName = (id: string) => str(findRow(products, "product_id", id)?.rec.name ?? null) || "your pack";

  const sections: TodoSection[] = [];

  sections.push({
    key: "new-leads",
    title: "New leads to contact",
    items: leads.rows
      .filter((r) => str(r.rec.status) === "New Lead" && (dateOnly(r.rec.date_added) ?? today) < today)
      .map((r) => ({
        name: str(r.rec.name) || str(r.rec.phone),
        phone: str(r.rec.phone),
        message: `Hello ${firstName(str(r.rec.name))}, this is ${ctx.brand}. Thanks for reaching out — how can I help?`,
        meta: str(r.rec.interest),
      })),
  });

  // "~24h" at date granularity: created before today counts as overdue.
  const aged = (r: {rec: Record<string, Cell>}) => {
    const created = dateOnly(r.rec.created_at);
    return created !== null && created < today;
  };

  sections.push({
    key: "abandoned",
    title: "Website orders not confirmed",
    items: orders.rows
      .filter((r) => str(r.rec.status) === "Started on website" && aged(r))
      .map((r) => ({
        name: str(r.rec.customer_name),
        phone: str(r.rec.phone),
        message: `Hello ${firstName(str(r.rec.customer_name))}, this is ${ctx.brand}. I saw your order ${str(r.rec.order_id)} on our website — would you like to go ahead? I'm happy to answer any questions.`,
        meta: str(r.rec.items_text),
      })),
  });

  sections.push({
    key: "unpaid",
    title: "Orders awaiting payment",
    items: orders.rows
      .filter((r) => str(r.rec.status) === "Awaiting Payment" && aged(r))
      .map((r) => ({
        name: str(r.rec.customer_name),
        phone: str(r.rec.phone),
        message: `Hello ${firstName(str(r.rec.customer_name))}, gentle reminder that your order ${str(r.rec.order_id)} is still awaiting payment. Would you like me to keep it aside for you?`,
        meta: str(r.rec.items_text),
      })),
  });

  const queueItem = (r: {rec: Record<string, Cell>}, kind: "day3" | "day14" | "reorder"): TodoEntry | null => {
    const delivered = dateOnly(r.rec.delivered_at);
    if (!delivered) return null;
    const dates = reorderDueDates(delivered, num(r.rec.pack_days) ?? 30, num(r.rec.qty) ?? 1);
    const due = kind === "day3" ? dates.day3 : kind === "day14" ? dates.day14 : dates.due;
    const sent = kind === "day3" ? r.rec.day3_sent : kind === "day14" ? r.rec.day14_sent : r.rec.reorder_sent;
    if (due > today || yn(sent)) return null;
    const name = leadName(str(r.rec.phone));
    const product = productName(str(r.rec.product_id));
    const message =
      kind === "day3"
        ? `Hello ${name}, it's ${ctx.brand}. How are you getting on with your ${product}? If anything about how to use it is unclear, just reply here.`
        : kind === "day14"
          ? `Hello ${name}, it's ${ctx.brand}. You're about two weeks in with ${product} — how is it going? Any questions, I'm here.`
          : `Hello ${name}, it's ${ctx.brand}. Your ${product} should be running low about now. Would you like me to set aside another pack for you?`;
    return {name, phone: str(r.rec.phone), message, meta: `${product} · order ${str(r.rec.order_id)}`};
  };

  for (const [kind, key, title] of [
    ["day3", "day3", "Day-3 check-ins"],
    ["day14", "day14", "Day-14 check-ins"],
    ["reorder", "reorders", "Reorders due"],
  ] as const) {
    sections.push({key, title, items: queue.rows.map((r) => queueItem(r, kind)).filter((e): e is TodoEntry => e !== null)});
  }

  // Win-backs: 60 quiet days → list them and mark Inactive so they appear once.
  const winbacks = leads.rows.filter((r) => {
    const last = dateOnly(r.rec.last_order_at);
    return last !== null && daysBetween(last, today) >= 60 && str(r.rec.status) !== "Inactive" && str(r.rec.status) !== "";
  });
  sections.push({
    key: "winback",
    title: "Customers we haven't heard from (60 days)",
    items: winbacks.map((r) => ({
      name: str(r.rec.name),
      phone: str(r.rec.phone),
      message: `Hello ${firstName(str(r.rec.name))}, it's ${ctx.brand}. It's been a while — how are you doing? Our free weekly seminar is on again this Saturday if you'd like to come.`,
    })),
  });
  for (const r of winbacks) store.patch(TABS.leads, r.row, {status: "Inactive"});

  sections.push({
    key: "rewards",
    title: "Referral rewards to send",
    items: referrals.rows
      .filter((r) => str(r.rec.reward_status) === "Due")
      .map((r) => ({
        name: str(r.rec.referrer_name),
        phone: str(r.rec.referrer_phone),
        message: `Hello ${firstName(str(r.rec.referrer_name))}, good news — someone you referred just placed their first order. Your reward (${ctx.rewardText}) is ready. Thank you!`,
        meta: `code ${str(r.rec.code)}`,
      })),
  });

  sections.push({
    key: "dupes",
    title: "Duplicate referral codes to resolve",
    items: referrals.rows
      .filter((r) => yn(r.rec.duplicate_flag))
      .map((r) => ({
        name: str(r.rec.referrer_name),
        phone: str(r.rec.referrer_phone),
        message: "",
        meta: `code ${str(r.rec.code)} is claimed by more than one number`,
      })),
  });

  return sections;
}

/** HTML body: one table per non-empty section, each row with a wa.me button. */
export function todoEmailHtml(sections: TodoSection[], brand: string): string {
  const parts = sections
    .filter((s) => s.items.length)
    .map((s) => {
      const rows = s.items
        .map((item) => {
          const button = item.message
            ? `<a href="${wa(item.phone, item.message)}" style="display:inline-block;background:#25D366;color:#0B2E1A;font-weight:600;padding:8px 14px;border-radius:20px;text-decoration:none">Message</a>`
            : "";
          return `<tr><td style="padding:6px 10px">${esc(item.name)}<br><span style="color:#666;font-size:12px">${esc(item.meta ?? "")}</span></td><td style="padding:6px 10px">${button}</td></tr>`;
        })
        .join("");
      return `<h3 style="margin:18px 0 6px">${esc(s.title)} (${s.items.length})</h3><table style="border-collapse:collapse;width:100%">${rows}</table>`;
    });
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const body = total === 0 ? `<p>Nothing due today. 🎉</p>` : parts.join("");
  return `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222"><h2>${esc(brand)} — today's follow-ups</h2>${body}</div>`;
}

export function todoSubject(sections: TodoSection[], brand: string): string {
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  return `${brand} — today's follow-ups (${total})`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** GAS entry point — collects, then emails the distributor. */
export function sendTodoEmail(store: Store, email: string, ctx: TodoContext, now: Date = new Date()): void {
  const sections = collectTodo(store, now, ctx);
  MailApp.sendEmail({to: email, subject: todoSubject(sections, ctx.brand), htmlBody: todoEmailHtml(sections, ctx.brand)});
}

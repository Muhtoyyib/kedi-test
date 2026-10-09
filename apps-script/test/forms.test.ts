import {describe, expect, it} from "vitest";
import {parseFormPayload, recordForm} from "../src/forms.ts";
import {TABS} from "../src/schema.ts";
import {MemoryStore} from "./fakes.ts";

const NOW = new Date(2026, 9, 9, 8);

const submit = (store: MemoryStore, kind: "contact" | "business_interest" | "seminar_interest", raw: Record<string, unknown>) => {
  const payload = parseFormPayload(kind, raw);
  return payload ? recordForm(store, payload, NOW) : {ok: false};
};

const leads = (store: MemoryStore) => store.table(TABS.leads).rows;

describe("parseFormPayload", () => {
  const base = {name: "Bola Tin", phone: "08031234567", location: "Yaba", message: "What helps with digestion?", consent: true};

  it("accepts a valid contact and normalises the phone", () => {
    expect(parseFormPayload("contact", base)?.phone).toBe("+2348031234567");
  });

  it.each([
    [{consent: false}, "consent false"],
    [{consent: "yes"}, "consent not boolean"],
    [{phone: "012345678"}, "landline"],
    [{name: ""}, "empty name"],
    [{phone: ""}, "empty phone"],
  ])("rejects %s", (patch: Record<string, unknown>, _label: string) => {
    expect(parseFormPayload("contact", {...base, ...patch})).toBeNull();
  });

  it("truncates over-long fields rather than trusting the browser", () => {
    const p = parseFormPayload("contact", {...base, message: "x".repeat(3000)});
    expect(p?.message).toHaveLength(2000);
  });
});

describe("recordForm", () => {
  it("creates a New Lead with the contact source and notes", () => {
    const store = new MemoryStore();
    submit(store, "contact", {
      name: "Bola Tin",
      phone: "08031234567",
      location: "Yaba",
      message: "What helps with digestion?",
      consent: true,
    });
    const lead = leads(store)[0];
    expect(lead.rec.status).toBe("New Lead");
    expect(lead.rec.source).toBe("contact_form");
    expect(lead.rec.interest).toBe("General enquiry");
    expect(String(lead.rec.notes)).toContain("What helps with digestion?");
    expect(lead.rec.consent).toBe("Yes");
  });

  it("marks business_interest and keeps an existing customer's status", () => {
    const store = new MemoryStore({leads: [{phone: "+2348031234567", name: "Amaka", status: "Customer", area: "Ikeja"}]});
    submit(store, "business_interest", {
      name: "Amaka O",
      phone: "+2348031234567",
      location: "Lagos",
      message: "Tell me about joining",
      consent: true,
    });
    const lead = leads(store)[0];
    expect(lead.rec.status).toBe("Customer");
    expect(lead.rec.business_interest).toBe("Yes");
    expect(lead.rec.last_contact).toBe("2026-10-09");
    expect(leads(store)).toHaveLength(1);
  });

  it("uses the seminar source for seminar_interest", () => {
    const store = new MemoryStore();
    submit(store, "seminar_interest", {name: "Bola", phone: "08031234567", consent: true});
    expect(leads(store)[0].rec.source).toBe("seminar_form");
    expect(leads(store)[0].rec.interest).toBe("Seminar");
  });

  it("appends notes instead of overwriting them", () => {
    const store = new MemoryStore({leads: [{phone: "+2348031234567", name: "Amaka", status: "Contacted", notes: "first note"}]});
    submit(store, "contact", {name: "Amaka", phone: "08031234567", message: "second question", consent: true});
    expect(String(leads(store)[0].rec.notes)).toContain("first note");
    expect(String(leads(store)[0].rec.notes)).toContain("second question");
  });
});

import {describe, expect, it} from "vitest";
import {parseReferralPayload, registerReferralCode} from "../src/referrals.ts";
import {TABS} from "../src/schema.ts";
import {MemoryStore} from "./fakes.ts";

const NOW = new Date(2026, 9, 9, 8);
const raw = {code: "AMAKA-4567", firstName: "Amaka", phone: "08031234567"};

const submit = (store: MemoryStore, patch: Record<string, unknown> = {}) => {
  const payload = parseReferralPayload({...raw, ...patch});
  return payload ? registerReferralCode(store, payload, NOW) : {ok: false};
};

describe("parseReferralPayload", () => {
  it("normalises the phone and upcases the code", () => {
    const p = parseReferralPayload({...raw, code: "amaka-4567"});
    expect(p).toMatchObject({code: "AMAKA-4567", phone: "+2348031234567"});
  });

  it.each([[{phone: "bad"}], [{code: "!!"}], [{firstName: ""}], [{code: "A".repeat(30)}]])("rejects %s", (patch) => {
    expect(parseReferralPayload({...raw, ...patch})).toBeNull();
  });
});

describe("registerReferralCode", () => {
  it("stores a new code as Pending", () => {
    const store = new MemoryStore();
    expect(submit(store)).toEqual({ok: true});
    const row = store.table(TABS.referrals).rows[0];
    expect(row.rec.reward_status).toBe("Pending");
    expect(row.rec.duplicate_flag).toBe("No");
  });

  it("same code + same phone → no-op, no new row", () => {
    const store = new MemoryStore();
    submit(store);
    submit(store);
    expect(store.table(TABS.referrals).rows).toHaveLength(1);
  });

  it("same code + different phone → stored flagged duplicate for review", () => {
    const store = new MemoryStore();
    submit(store);
    submit(store, {firstName: "Fake Amaka", phone: "09099999999"});
    const rows = store.table(TABS.referrals).rows;
    expect(rows).toHaveLength(2);
    expect(rows[1].rec.duplicate_flag).toBe("Yes");
    expect(rows[1].rec.referrer_phone).toBe("+2349099999999");
  });
});

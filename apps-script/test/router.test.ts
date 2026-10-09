import {describe, expect, it} from "vitest";
import {routeGet, routePost} from "../src/router.ts";
import {TABS} from "../src/schema.ts";
import {fakeDoc, MemoryStore, routerDeps, seedCatalog} from "./fakes.ts";

const order = {
  orderId: "KD-1",
  customerName: "Amaka Obi",
  phone: "08031234567",
  area: "Ikeja",
  items: [{productId: "KD-P001", qty: 1}],
  subtotal: 18500,
};
const post = (body: unknown, deps = routerDeps(new MemoryStore(seedCatalog()), {convertDoc: () => fakeDoc()})) =>
  routePost({}, JSON.stringify(body), deps);

describe("routeGet", () => {
  const get = (params: Record<string, string>, store = new MemoryStore(seedCatalog())) =>
    routeGet(params, routerDeps(store, {convertDoc: () => fakeDoc()}));

  it("returns the catalog for a valid token", () => {
    const res = get({action: "catalog", token: "good-token"});
    expect(res.ok).toBe(true);
    expect((res.catalog as {products: unknown[]}).products).toHaveLength(1);
  });

  it.each<Record<string, string>>([{action: "catalog"}, {action: "catalog", token: "wrong"}])("rejects %o", (params) => {
    expect(get(params)).toEqual({ok: false, code: "unauthorized"});
  });

  it("returns the issues list when the catalog has errors", () => {
    const seed = seedCatalog();
    seed.products![0].category = "nope";
    const res = get({action: "catalog", token: "good-token"}, new MemoryStore(seed));
    expect(res).toMatchObject({ok: false, code: "invalid_catalog"});
  });
});

describe("routePost", () => {
  it("silently accepts honeypot submissions without writing", () => {
    const store = new MemoryStore(seedCatalog());
    const res = routePost({}, JSON.stringify({type: "order", hp: "spam", payload: order}), routerDeps(store));
    expect(res).toEqual({ok: true});
    expect(store.table(TABS.orders).rows).toHaveLength(0);
  });

  it("rejects bodies over 10 KB and invalid JSON", () => {
    expect(post({type: "order", payload: {...order, customerName: "x".repeat(11000)}})).toEqual({ok: false, code: "invalid_payload"});
    expect(routePost({}, "{nope", routerDeps(new MemoryStore()))).toEqual({ok: false, code: "invalid_payload"});
  });

  it("records a valid order", () => {
    const store = new MemoryStore(seedCatalog());
    const res = routePost({}, JSON.stringify({type: "order", payload: order}), routerDeps(store));
    expect(res).toEqual({ok: true, id: "KD-1"});
    expect(store.table(TABS.orders).rows).toHaveLength(1);
  });

  it("rate-limits a phone after 5 submissions in the window", () => {
    const store = new MemoryStore(seedCatalog());
    const deps = routerDeps(store);
    const body = (n: number) => JSON.stringify({type: "order", payload: {...order, orderId: `KD-${n}`}});
    for (let n = 0; n < 5; n++) expect(routePost({}, body(n), deps)).toMatchObject({ok: true});
    expect(routePost({}, body(5), deps)).toEqual({ok: false, code: "rate_limited"});
  });

  it("rate-limits globally at 60/min regardless of phone", () => {
    const store = new MemoryStore(seedCatalog());
    const deps = routerDeps(store);
    const body = (n: number) =>
      JSON.stringify({type: "contact", payload: {name: `P${n}`, phone: `080${String(31000000 + n)}`, consent: true}});
    let limited: unknown;
    for (let n = 0; n < 70; n++) {
      const res = routePost({}, body(n), deps);
      if ((res as {code?: string}).code === "rate_limited") {
        limited = res;
        break;
      }
    }
    expect(limited).toEqual({ok: false, code: "rate_limited"});
  });

  it("handles publish_result only with a valid token", () => {
    const store = new MemoryStore({
      publishLog: [{requested_at: "x", requested_by: "menu", run_url: "", status: "Requested", finished_at: "", commit: "", message: ""}],
    });
    const deps = routerDeps(store);
    const body = (token?: string) =>
      JSON.stringify({token, payload: {status: "success", runUrl: "https://github.com/x/runs/1", commit: "c", message: ""}});
    expect(routePost({action: "publish_result"}, body("wrong"), deps)).toEqual({ok: false, code: "unauthorized"});
    expect(routePost({action: "publish_result"}, body("good-token"), deps)).toEqual({ok: true});
    expect(store.table(TABS.publishLog).rows[0].rec.status).toBe("Live");
  });

  it("routes contact forms and referral codes", () => {
    const store = new MemoryStore(seedCatalog());
    const deps = routerDeps(store);
    expect(post({type: "contact", payload: {name: "Bola", phone: "08031234567", message: "hi", consent: true}}, deps)).toEqual({ok: true});
    expect(post({type: "referral_code", payload: {code: "AMAKA-4567", firstName: "Amaka", phone: "08031234567"}}, deps)).toEqual({
      ok: true,
    });
    expect(post({type: "unknown"}, deps)).toEqual({ok: false, code: "invalid_payload"});
  });
});

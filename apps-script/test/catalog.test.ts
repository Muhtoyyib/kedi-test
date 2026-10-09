import {describe, expect, it} from "vitest";
import {buildCatalog} from "../src/catalog.ts";
import {Issues} from "../src/validate.ts";
import type {TabKey} from "../src/schema.ts";
import type {Cell} from "../src/table.ts";
import {MemoryStore, seedCatalog} from "./fakes.ts";

function check(seed: Partial<Record<TabKey, Record<string, Cell>[]>> = {}) {
  const issues = new Issues();
  const catalog = buildCatalog(new MemoryStore({...seedCatalog(), ...seed}), issues, {
    now: new Date("2026-10-09T00:00:00Z"),
    convertDoc: () => ({title: null, blocks: [], readingMinutes: 1, warnings: [], errors: []}),
  });
  return {catalog, issues};
}

describe("buildCatalog", () => {
  it("returns a payload for valid data", () => {
    const {catalog, issues} = check();
    expect(issues.errors).toEqual([]);
    expect(catalog?.products).toHaveLength(1);
    expect(catalog?.products[0].slug).toBe("product-a");
    expect(catalog?.seminars[0].startsAt).toBe("2026-10-12T16:00:00+01:00");
    expect(catalog?.settings.referralRewardText ?? "").not.toBeUndefined();
  });

  it("leaves inactive products out", () => {
    const seed = seedCatalog();
    seed.products![0].active = "No";
    const {catalog} = check(seed);
    expect(catalog?.products).toHaveLength(0);
  });

  it("errors when a product's category is unknown", () => {
    const seed = seedCatalog();
    seed.products![0].category = "nonexistent";
    const {catalog, issues} = check(seed);
    expect(catalog).toBeNull();
    expect(issues.errors[0].message).toContain("isn't in Categories");
    expect(issues.errors[0].id).toBe("KD-P001");
    expect(issues.errors[0].row).toBe(2);
  });

  it("errors on duplicate product_id and slug", () => {
    const seed = seedCatalog();
    seed.products!.push({...seed.products![0]});
    const {issues} = check(seed);
    expect(issues.errors.some((e) => e.message.includes("duplicate product_id"))).toBe(true);
    expect(issues.errors.some((e) => e.message.includes("duplicate slug"))).toBe(true);
  });

  it("errors on a non-numeric price and out-of-range pack_days", () => {
    const seed = seedCatalog();
    seed.products![0].price_ngn = "cheap";
    const {issues} = check(seed);
    expect(issues.errors.some((e) => e.message.includes("price_ngn"))).toBe(true);
    const seed2 = seedCatalog();
    seed2.products![0].pack_days = 500;
    expect(check(seed2).issues.errors.some((e) => e.message.includes("pack_days"))).toBe(true);
  });

  it("errors when image_ids is empty", () => {
    const seed = seedCatalog();
    seed.products![0].image_ids = "";
    expect(check(seed).issues.errors.some((e) => e.message.includes("image_ids"))).toBe(true);
  });

  it("errors on a bad seminar date", () => {
    const seed = seedCatalog();
    seed.seminars![0].date = "12-10-2026";
    const {issues} = check(seed);
    expect(issues.errors.some((e) => e.tab === "Seminar Schedule" && e.message.includes("YYYY-MM-DD"))).toBe(true);
  });

  it("errors on a non-https luma link", () => {
    const seed = seedCatalog();
    seed.seminars![0].luma_url = "http://lu.ma/abc";
    expect(check(seed).issues.errors.some((e) => e.message.includes("https"))).toBe(true);
  });

  it("warns (not errors) on banned words in product text", () => {
    const seed = seedCatalog();
    seed.products![0].description = "This product cures everything.";
    const {catalog, issues} = check(seed);
    expect(catalog).not.toBeNull();
    expect(issues.warnings.some((w) => w.message.includes("cures"))).toBe(true);
  });

  it("warns when short_benefit is over 90 chars and truncates it", () => {
    const seed = seedCatalog();
    seed.products![0].short_benefit = "x".repeat(100);
    const {catalog, issues} = check(seed);
    expect(issues.warnings.some((w) => w.message.includes("90"))).toBe(true);
    expect(catalog?.products[0].shortBenefit).toHaveLength(90);
  });

  it("returns issues with the catalog when only warnings exist", () => {
    const {catalog} = check();
    expect(catalog).not.toBeNull();
  });
});

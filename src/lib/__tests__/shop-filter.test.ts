import {describe, expect, it} from "vite-plus/test";
import fc from "fast-check";
import {catalog} from "@/lib/catalog/data";
import {isShopSort, searchProducts, sortProducts, SHOP_SORTS} from "@/lib/shop/filter";
import {validateShopSearch} from "@/features/shop/use-shop-query";
import {searchEnquiry} from "@/lib/whatsapp/messages";

const items = catalog.products;
const namer = (slug: string) => catalog.categories.find((c) => c.slug === slug)?.name ?? slug;

describe("searchProducts", () => {
  it("AND-matches every term, case and accents ignored", () => {
    const found = searchProducts(items, "fixture digestive");
    expect(found.map((p) => p.id)).toContain("KD-F001");
    // accent-folded query still matches
    expect(searchProducts(items, "dígestive")).toEqual(found);
    // a term that only some products share
    expect(searchProducts(items, "fixture").length).toBe(items.length);
    // nothing matches both words → empty
    expect(searchProducts(items, "digestive ginseng")).toHaveLength(0);
  });

  it("matches against the category name and pack size", () => {
    const immunity = searchProducts(items, "immune", namer);
    expect(immunity.every((p) => p.categorySlug === "immunity")).toBe(true);
    expect(immunity.length).toBeGreaterThan(0);
    const teabags = searchProducts(items, "teabags");
    expect(teabags.some((p) => p.packSize.includes("teabags"))).toBe(true);
  });

  it("empty/blank query returns everything", () => {
    expect(searchProducts(items, "")).toBe(items);
    expect(searchProducts(items, "   ")).toBe(items);
  });
});

describe("sortProducts", () => {
  it("recommended puts in-stock items first, then catalog order", () => {
    const sorted = sortProducts(items, "recommended");
    const firstOos = sorted.findIndex((p) => !p.inStock);
    expect(sorted.slice(firstOos).every((p) => !p.inStock)).toBe(true);
    const inStock = sorted.slice(0, firstOos);
    expect(inStock.map((p) => p.sortOrder)).toEqual([...inStock.map((p) => p.sortOrder)].sort((a, b) => a - b));
  });

  it("price sorts keep ask-price products last", () => {
    for (const sort of ["price-asc", "price-desc"] as const) {
      const sorted = sortProducts(items, sort);
      const lastPriced = sorted.length - 1 - [...sorted].reverse().findIndex((p) => p.priceNgn !== null);
      expect(sorted.slice(lastPriced + 1).every((p) => p.priceNgn === null)).toBe(true);
      const prices = sorted.filter((p) => p.priceNgn !== null).map((p) => p.priceNgn!);
      expect(prices).toEqual([...prices].sort((a, b) => (sort === "price-asc" ? a - b : b - a)));
    }
  });

  it("name sorts alphabetically and does not mutate the input", () => {
    const before = [...items];
    const sorted = sortProducts(items, "name");
    expect(sorted.map((p) => p.name)).toEqual([...items.map((p) => p.name)].sort((a, b) => a.localeCompare(b)));
    expect(items).toEqual(before);
  });

  it("fast-check: output is always a permutation of the input", () => {
    fc.assert(
      fc.property(fc.constantFrom(...SHOP_SORTS), fc.string({maxLength: 20}), (sort, q) => {
        const result = sortProducts(searchProducts(items, q), sort);
        expect(result.every((p) => items.includes(p))).toBe(true);
        expect(new Set(result.map((p) => p.id)).size).toBe(result.length);
      })
    );
  });
});

describe("isShopSort / validateShopSearch", () => {
  it("accepts only known sorts and non-empty q", () => {
    expect(isShopSort("price-asc")).toBe(true);
    expect(isShopSort("bogus")).toBe(false);
    expect(validateShopSearch({q: " tea ", sort: "price-desc"})).toEqual({q: " tea ", sort: "price-desc"});
    expect(validateShopSearch({q: "   ", sort: "bogus", other: "x"})).toEqual({q: undefined, sort: undefined});
  });
});

describe("searchEnquiry", () => {
  it("embeds the search term in the WhatsApp message", () => {
    expect(searchEnquiry("ginseng drink")).toContain('"ginseng drink"');
    expect(searchEnquiry("ginseng drink")).toContain("couldn't find it");
  });
});

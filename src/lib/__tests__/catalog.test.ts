import {describe, expect, it} from "vitest";
import {getArticles, getArticle, getRelatedArticles, getTopicsWithCounts} from "../catalog/articles.ts";
import {getCategories, getCategory, getProductsByCategory} from "../catalog/categories.ts";
import {getHighlights} from "../catalog/highlights.ts";
import {getFeaturedProducts, getProduct, getProducts, getRelatedProducts} from "../catalog/products.ts";
import {getDeliveryAreas, getSettings} from "../catalog/settings.ts";
import {getNextSeminar, getPastSeminars, getSeminars} from "../catalog/seminars.ts";
import {getStories, getStory} from "../catalog/stories.ts";
import {getVideos} from "../catalog/videos.ts";
import type {Catalog, Product, Seminar, Story, Article} from "../catalog/types.ts";
import {fixtureCatalog} from "../../test-utils/fixtures.ts";

const product = (id: string, over: Partial<Product> = {}): Product => ({
  id,
  slug: id.toLowerCase(),
  name: `Product ${id}`,
  categorySlug: "digestion",
  priceNgn: 1000,
  packSize: "60 caps",
  packDays: 30,
  inStock: true,
  featured: false,
  sortOrder: 999,
  shortBenefit: "s",
  description: ["d"],
  ingredients: [],
  howToUse: ["h"],
  nafdacNo: null,
  images: [],
  relatedIds: [],
  faqs: [],
  seo: {title: "t", description: "d"},
  ...over,
});

const seminar = (id: string, startsAt: string, over: Partial<Seminar> = {}): Seminar => ({
  id,
  startsAt,
  endsAt: `${startsAt.slice(0, 11)}17:30:00+01:00`,
  topic: "t",
  summary: "s",
  learnPoints: [],
  audience: "all",
  format: "physical",
  venue: "v",
  lumaUrl: "https://lu.ma/x",
  lumaEventId: "e",
  status: "scheduled",
  recordingUrl: null,
  ...over,
});

const story = (id: string, over: Partial<Story> = {}): Story => ({
  id,
  slug: id.toLowerCase(),
  name: "First L.",
  area: "a",
  quote: "q",
  fullStory: [],
  photo: null,
  video: null,
  kind: "written",
  consent: {date: "2026-01-01", channel: "whatsapp"},
  featured: false,
  date: "2026-01-01",
  ...over,
});

const article = (id: string, over: Partial<Article> = {}): Article => ({
  id,
  slug: id.toLowerCase(),
  title: `A${id}`,
  description: "d",
  topic: "digestion",
  date: "2026-01-01",
  cover: {key: "k", alt: "a", width: 1, height: 1, variants: []},
  coverAlt: "a",
  relatedCategory: null,
  readingMinutes: 2,
  body: [],
  toc: [],
  ...over,
});

const cat = (over: Partial<Catalog> = {}): Catalog => ({
  source: "fixture",
  generatedAt: "2026-10-10T09:00:00.000Z",
  products: [],
  categories: [
    {slug: "digestion", name: "Digestion", description: "d", sortOrder: 2, image: null},
    {slug: "energy", name: "Energy", description: "d", sortOrder: 1, image: null},
  ],
  settings: {
    bank: null,
    openingHours: "",
    pickupAddress: "",
    deliveryNote: "",
    announcement: null,
    seminarOfferText: null,
    referralRewardText: "",
    referralFriendRewardText: "",
    loyaltyText: null,
    freeDeliveryThresholdNgn: null,
  },
  delivery: [],
  seminars: [],
  highlights: [],
  videos: [],
  stories: [],
  articles: [],
  ...over,
});

describe("product ordering", () => {
  it("orders by sortOrder then name, with out-of-stock last", () => {
    const c = cat({
      products: [
        product("B", {sortOrder: 1, name: "Zeta"}),
        product("A", {sortOrder: 1, name: "Alpha"}),
        product("C", {sortOrder: 0, inStock: false}),
        product("D", {sortOrder: 2}),
      ],
    });
    expect(getProducts(c).map((p) => p.id)).toEqual(["A", "B", "D", "C"]);
  });

  it("getProductsByCategory filters and keeps grid order", () => {
    const c = cat({
      products: [
        product("A", {categorySlug: "digestion", sortOrder: 2}),
        product("B", {categorySlug: "energy", sortOrder: 1}),
        product("C", {categorySlug: "digestion", sortOrder: 1, inStock: false}),
      ],
    });
    expect(getProductsByCategory("digestion", c).map((p) => p.id)).toEqual(["A", "C"]);
    expect(getProductsByCategory("energy", c).map((p) => p.id)).toEqual(["B"]);
  });

  it("categories sort by sortOrder", () => {
    const c = cat({});
    expect(getCategories(c).map((x) => x.slug)).toEqual(["energy", "digestion"]);
    expect(getCategory("digestion", c)?.name).toBe("Digestion");
  });
});

describe("getFeaturedProducts", () => {
  it("shows featured first and fills to 4 with in-stock products", () => {
    const c = cat({
      products: [
        product("F1", {featured: true, sortOrder: 5}),
        product("F2", {featured: true, sortOrder: 1}),
        product("N1", {sortOrder: 2}),
        product("N2", {sortOrder: 3}),
        product("N3", {sortOrder: 4, inStock: false}),
      ],
    });
    expect(getFeaturedProducts(4, c).map((p) => p.id)).toEqual(["F2", "F1", "N1", "N2"]);
  });

  it("respects the limit when enough featured exist", () => {
    const c = cat({products: ["F1", "F2", "F3", "F4", "F5"].map((id, i) => product(id, {featured: true, sortOrder: i}))});
    expect(getFeaturedProducts(4, c).map((p) => p.id)).toEqual(["F1", "F2", "F3", "F4"]);
  });
});

describe("getRelatedProducts", () => {
  const c = cat({
    products: [
      product("SELF", {relatedIds: ["R1", "MISSING"], sortOrder: 0}),
      product("R1", {sortOrder: 9}),
      product("SAME", {categorySlug: "digestion", sortOrder: 1}),
      product("OTHER", {categorySlug: "energy", sortOrder: 1}),
      product("OTHER2", {categorySlug: "energy", sortOrder: 2}),
    ],
  });
  it("follows relatedIds, skips missing, fills same-category then others, caps at 4", () => {
    const self = getProducts(c).find((p) => p.id === "SELF")!;
    expect(getRelatedProducts(self, 4, c).map((p) => p.id)).toEqual(["R1", "SAME", "OTHER", "OTHER2"]);
  });
  it("works with no relatedIds", () => {
    const self = getProducts(c).find((p) => p.id === "R1")!;
    const rel = getRelatedProducts(self, 4, c).map((p) => p.id);
    expect(rel[0]).toBe("SELF"); // same category first
    expect(rel).not.toContain("R1");
  });
});

describe("seminars", () => {
  const c = cat({
    seminars: [
      seminar("NEXT", "2026-10-17T16:00:00+01:00"),
      seminar("LATER", "2026-10-24T16:00:00+01:00"),
      seminar("PAST", "2026-10-03T16:00:00+01:00", {status: "done"}),
    ],
  });

  it("returns the earliest scheduled seminar in the future", () => {
    expect(getNextSeminar("2026-10-10T12:00:00+01:00", c)?.id).toBe("NEXT");
  });

  it("skips a seminar already underway (stale prerender case)", () => {
    expect(getNextSeminar("2026-10-17T16:30:00+01:00", c)?.id).toBe("LATER");
  });

  it("WAT boundary: the seminar counts as next up to its start instant", () => {
    expect(getNextSeminar("2026-10-17T15:59:59+01:00", c)?.id).toBe("NEXT");
    expect(getNextSeminar("2026-10-17T16:00:00+01:00", c)?.id).toBe("LATER");
  });

  it("skips cancelled seminars and returns undefined when none remain", () => {
    const cancelled = cat({
      seminars: [seminar("A", "2026-10-17T16:00:00+01:00", {status: "cancelled"}), seminar("B", "2026-10-24T16:00:00+01:00")],
    });
    expect(getNextSeminar("2026-10-10T00:00:00+01:00", cancelled)?.id).toBe("B");
    expect(getNextSeminar("2027-01-01T00:00:00+01:00", c)).toBeUndefined();
  });

  it("getPastSeminars returns done/ended seminars newest first", () => {
    const past = getPastSeminars("2026-10-18T00:00:00+01:00", c);
    expect(past.map((s) => s.id)).toEqual(["NEXT", "PAST"]);
    expect(getSeminars(c).map((s) => s.id)).toEqual(["PAST", "NEXT", "LATER"]);
  });
});

describe("client content ordering", () => {
  const c = cat({
    stories: [
      story("OLD", {date: "2026-01-01"}),
      story("MID", {date: "2026-03-01"}),
      story("NEW", {date: "2026-05-01"}),
      story("FEAT", {date: "2026-02-01", featured: true}),
    ],
    articles: [
      article("D1", {topic: "digestion", date: "2026-05-01"}),
      article("D2", {topic: "digestion", date: "2026-04-01"}),
      article("D3", {topic: "digestion", date: "2026-03-01"}),
      article("E1", {topic: "energy", date: "2026-04-15"}),
    ],
  });

  it("stories: featured first, then newest", () => {
    expect(getStories({}, c).map((s) => s.id)).toEqual(["FEAT", "NEW", "MID", "OLD"]);
    expect(getStories({featured: true}, c).map((s) => s.id)).toEqual(["FEAT"]);
    expect(getStory("MID", c)?.name).toBe("First L.");
  });

  it("articles: newest first, filterable by topic; counts omit empty topics", () => {
    expect(getArticles({}, c).map((a) => a.id)).toEqual(["D1", "E1", "D2", "D3"]);
    expect(getArticles({topic: "energy"}, c).map((a) => a.id)).toEqual(["E1"]);
    expect(getTopicsWithCounts(c)).toEqual([
      {topic: "digestion", count: 3},
      {topic: "energy", count: 1},
    ]);
  });

  it("related articles prefer the same topic", () => {
    const d3 = getArticle("d3", c)!;
    expect(getRelatedArticles(d3, 2, c).map((a) => a.id)).toEqual(["D1", "D2"]);
  });

  it("highlights newest first with limit; videos filterable", () => {
    const h = cat({
      highlights: [
        {id: "H1", date: "2026-01-01", topic: "t", seminarId: null, photos: [], video: null, comment: null},
        {id: "H2", date: "2026-06-01", topic: "t", seminarId: null, photos: [], video: null, comment: null},
      ],
    });
    expect(getHighlights(1, h)[0]?.id).toBe("H2");

    const vids = cat({
      videos: [
        {
          id: "V1",
          title: "a",
          topic: "energy",
          durationText: null,
          date: "2026-01-01",
          video: {provider: "youtube", id: "x", url: "u", poster: {key: "k", alt: "", width: 1, height: 1, variants: []}},
        },
        {
          id: "V2",
          title: "b",
          topic: "digestion",
          durationText: null,
          date: "2026-02-01",
          video: {provider: "youtube", id: "y", url: "u", poster: {key: "k", alt: "", width: 1, height: 1, variants: []}},
        },
      ],
    });
    expect(getVideos({}, vids).map((v) => v.id)).toEqual(["V2", "V1"]);
    expect(getVideos({topic: "energy"}, vids).map((v) => v.id)).toEqual(["V1"]);
  });
});

describe("fixture data", () => {
  it("the shipped fixture parses into a full catalog", () => {
    expect(fixtureCatalog.products).toHaveLength(9);
    expect(getProduct("fixture-heart-support", fixtureCatalog)?.inStock).toBe(false);
    expect(getFeaturedProducts(4, fixtureCatalog)).toHaveLength(4);
    expect(getSettings(fixtureCatalog).bank?.accountNumber).toBe("0123456789");
    expect(getDeliveryAreas(fixtureCatalog)).toHaveLength(6);
  });
});

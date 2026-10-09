import {describe, expect, it} from "vitest";
import fixture from "../../fixtures/catalog.fixture.json";
import type {UntrustedValue} from "../../../src/lib/untrusted.ts";
import {CatalogError, type WireBlock} from "../parsed-types.ts";
import {parseCatalog} from "../parse-catalog.ts";

const cat = (slug = "digestion") => ({slug, name: "Digestion", description: "d", sortOrder: 1, imageId: null});

const product = (over: Record<string, UntrustedValue> = {}) => ({
  id: "KD-P001",
  slug: "p-one",
  name: "Product One",
  categorySlug: "digestion",
  priceNgn: 1000,
  packSize: "60 caps",
  packDays: 30,
  inStock: true,
  featured: false,
  sortOrder: 1,
  shortBenefit: "supports wellbeing",
  description: ["line"],
  ingredients: [],
  howToUse: ["daily"],
  nafdacNo: null,
  imageIds: ["img1"],
  relatedIds: [],
  faqs: [],
  seo: {title: "", description: ""},
  ...over,
});

const seminar = (over: Record<string, UntrustedValue> = {}) => ({
  id: "S1",
  date: "2026-10-17",
  start_time: "16:00",
  end_time: "17:30",
  topic: "t",
  summary: "s",
  learnPoints: ["a"],
  audience: "all",
  format: "physical",
  venue: "v",
  lumaUrl: "https://lu.ma/x",
  lumaEventId: "e1",
  status: "scheduled",
  recordingUrl: null,
  ...over,
});

const base = (over: Record<string, UntrustedValue> = {}) => ({
  source: "fixture",
  generatedAt: "2026-10-10T09:00:00.000Z",
  products: [product()],
  categories: [cat()],
  settings: {},
  delivery: [{area: "Lagos", zone: "local", feeNgn: 1000, timelineText: "same day"}],
  seminars: [seminar()],
  highlights: [],
  videos: [],
  stories: [],
  articles: [],
  ...over,
});

const errorsOf = (wire: UntrustedValue): string[] => {
  try {
    parseCatalog(wire);
    return [];
  } catch (e) {
    if (e instanceof CatalogError) return e.errors;
    throw e;
  }
};

describe("parseCatalog — happy path", () => {
  it("parses a minimal valid catalog", () => {
    const c = parseCatalog(base());
    expect(c.products).toHaveLength(1);
    expect(c.categories[0]?.slug).toBe("digestion");
    expect(c.delivery[0]?.zone).toBe("local");
  });

  it("parses the shipped fixture end to end", () => {
    const c = parseCatalog(fixture);
    expect(c.products).toHaveLength(9);
    expect(c.categories).toHaveLength(4);
    expect(c.delivery).toHaveLength(6);
    expect(c.seminars).toHaveLength(3);
    expect(c.highlights).toHaveLength(2);
    expect(c.videos).toHaveLength(4);
    expect(c.stories).toHaveLength(4);
    expect(c.articles).toHaveLength(3);
  });

  it("applies defaults: sortOrder 999, seo title/description, blank price → null", () => {
    const p = product({sortOrder: undefined, priceNgn: null, seo: undefined});
    const c = parseCatalog(base({products: [p]}));
    expect(c.products[0]?.sortOrder).toBe(999);
    expect(c.products[0]?.priceNgn).toBeNull();
    expect(c.products[0]?.seo.title).toBe("Product One — 60 caps");
    expect(c.products[0]?.seo.description).toBe("supports wellbeing");
  });

  it("derives slug from name when blank, splitting paragraphs and lists", () => {
    const p = product({slug: "", name: "Àdánmá Tea 500mg", description: "Para one.\n\nPara two.", howToUse: "step 1\nstep 2"});
    const c = parseCatalog(base({products: [p]}));
    expect(c.products[0]?.slug).toBe("adanma-tea-500mg");
    expect(c.products[0]?.description).toEqual(["Para one.", "Para two."]);
    expect(c.products[0]?.howToUse).toEqual(["step 1", "step 2"]);
  });

  it("converts seminar date+time into ISO +01:00", () => {
    const c = parseCatalog(base());
    expect(c.seminars[0]?.startsAt).toBe("2026-10-17T16:00:00+01:00");
    expect(c.seminars[0]?.endsAt).toBe("2026-10-17T17:30:00+01:00");
  });
});

describe("parseCatalog — product errors", () => {
  it("names tab, row and id on a bad price", () => {
    const rows = [
      product(),
      product({id: "KD-P002", slug: "p2"}),
      product({id: "KD-P003", slug: "p3"}),
      product({id: "KD-P004", slug: "p4"}),
      product({id: "KD-P005", slug: "p5"}),
      product({id: "KD-P007", slug: "p7", priceNgn: "many"}),
    ];
    expect(errorsOf(base({products: rows}))).toContain("Products row 7 (KD-P007): price_ngn is not a number");
  });

  it("rejects duplicate ids and slugs", () => {
    const dup = product({id: "KD-P001", slug: "p-one"});
    const errors = errorsOf(base({products: [product(), product({id: "KD-P001", slug: "other"}), dup]}));
    expect(errors.join("\n")).toContain('duplicate product_id "KD-P001"');
    expect(errors.join("\n")).toContain('duplicate slug "p-one"');
  });

  it("rejects unknown categories and bad pack days", () => {
    const errors = errorsOf(base({products: [product({categorySlug: "nope"}), product({id: "KD-P2", slug: "x", packDays: 400})]}));
    expect(errors.join("\n")).toContain('category "nope" isn\'t in Categories');
    expect(errors.join("\n")).toContain("pack_days must be a whole number from 1 to 365");
  });

  it("requires description, how_to_use and at least one image", () => {
    const errors = errorsOf(base({products: [product({description: [], howToUse: [], imageIds: []})]}));
    expect(errors.join("\n")).toContain("description, how_to_use and image_ids are required");
  });

  it("fails when there are no products at all", () => {
    expect(errorsOf(base({products: []})).join("\n")).toContain("Catalog has no active products");
  });
});

describe("parseCatalog — other sections", () => {
  it("rejects a bad luma url and bad status", () => {
    const errors = errorsOf(base({seminars: [seminar({lumaUrl: "http://x"})]}));
    expect(errors.join("\n")).toContain("luma_url must be an https:// link");
    const errors2 = errorsOf(base({seminars: [seminar({status: "maybe"})]}));
    expect(errors2.join("\n")).toContain("status scheduled/cancelled/done");
  });

  it("accepts ISO startsAt directly", () => {
    const c = parseCatalog(
      base({
        seminars: [
          seminar({startsAt: "2026-10-17T16:00:00+01:00", endsAt: "2026-10-17T17:30:00+01:00", date: "", start_time: "", end_time: ""}),
        ],
      })
    );
    expect(c.seminars[0]?.startsAt).toBe("2026-10-17T16:00:00+01:00");
  });

  it("rejects a bad delivery zone", () => {
    const errors = errorsOf(base({delivery: [{area: "X", zone: "africa", feeNgn: 1, timelineText: "t"}]}));
    expect(errors.join("\n")).toContain("zone (local/interstate/pickup)");
  });

  it("rejects stories without consent or with bad names", () => {
    const story = {
      id: "S1",
      name: "adaeze okafor",
      area: "Lagos",
      quote: "q",
      date: "2026-10-01",
      consent: {date: "2026-09-30", channel: "whatsapp"},
      fullStory: ["p"],
    };
    expect(errorsOf(base({stories: [story]})).join("\n")).toContain("name (first name + initial)");
    const noConsent = {...story, name: "Adaeze O.", consent: {date: "", channel: "whatsapp"}};
    expect(errorsOf(base({stories: [noConsent]})).join("\n")).toContain("consent date and channel");
  });

  it("rejects highlights without photos and bad video topics", () => {
    expect(errorsOf(base({highlights: [{id: "H1", photoIds: [], video: null}]})).join("\n")).toContain("at least one photo");
    const badVideo = {
      id: "V1",
      title: "t",
      topic: "nonsense",
      date: "2026-10-01",
      video: {provider: "youtube", id: "x", url: "https://youtu.be/x"},
    };
    expect(errorsOf(base({videos: [badVideo]})).join("\n")).toContain("valid topic");
  });
});

describe("parseCatalog — articles", () => {
  const block = (t: string, extra: Record<string, UntrustedValue> = {}) => ({type: t, ...extra});
  const article = (over: Record<string, UntrustedValue> = {}) => ({
    id: "A1",
    slug: "a-one",
    title: "Article One",
    description: "d",
    topic: "digestion",
    date: "2026-10-01",
    coverImageId: "cov",
    coverAlt: "alt",
    relatedCategory: "digestion",
    readingMinutes: 3,
    body: [block("p", {inlines: [{text: "hi"}]})],
    toc: [],
    ...over,
  });

  it("requires id, title, topic, cover and date", () => {
    const errors = errorsOf(base({articles: [article({topic: "nope"})]}));
    expect(errors.join("\n")).toContain("topic, description, cover image + alt and a valid date are required");
  });

  it("rejects unknown related_category", () => {
    expect(errorsOf(base({articles: [article({relatedCategory: "nope"})]})).join("\n")).toContain(
      'related_category "nope" isn\'t in Categories'
    );
  });

  it("parses every block type and derives the toc from h2s", () => {
    const body = [
      block("h2", {id: "", text: "First Section"}),
      block("h2", {id: "", text: "First Section"}),
      block("h3", {id: "sub", text: "Sub"}),
      block("p", {
        inlines: [
          {text: "b", bold: true},
          {text: " link ", href: "javascript:x"},
          {text: " ok", href: "/learn"},
        ],
      }),
      block("ul", {items: [[{text: "a"}]]}),
      block("ol", {items: [[{text: "b"}]]}),
      block("image", {ref: {doc: "d1", n: 0}, alt: "pic"}),
      block("video", {video: {provider: "youtube", id: "v", url: "https://youtu.be/v"}}),
      block("doctor-callout", {blocks: [block("p", {inlines: [{text: "see a doctor"}]})]}),
    ];
    const c = parseCatalog(base({articles: [article({body})]}));
    const b = c.articles[0]?.body ?? [];
    const para = b.find((x): x is Extract<WireBlock, {type: "p"}> => x.type === "p");
    const callout = b.find((x): x is Extract<WireBlock, {type: "doctor-callout"}> => x.type === "doctor-callout");
    expect(c.articles[0]?.toc).toEqual([
      {id: "first-section", text: "First Section"},
      {id: "first-section-2", text: "First Section"},
    ]);
    expect(para?.inlines.map((i) => i.href)).toEqual([undefined, undefined, "/learn"]);
    expect(callout?.blocks).toHaveLength(1);
  });

  it("errors on a bad block and a bad image ref", () => {
    expect(errorsOf(base({articles: [article({body: [block("table")]})]})).join("\n")).toContain('unrecognised block type "table"');
    expect(errorsOf(base({articles: [article({body: [block("image", {alt: "x"})]})]})).join("\n")).toContain("missing its doc/n ref");
  });
});

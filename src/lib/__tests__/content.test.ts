import {describe, expect, it} from "vitest";
import {getAbout} from "@/lib/content/about";
import {getBusinessContent} from "@/lib/content/business";
import {answerInlines, getFaqs, resolveAnswer} from "@/lib/content/faq";
import {getLegalPage, listLegalSlugs, type LegalEntryLike} from "@/lib/content/legal";
import type {Catalog, Settings} from "@/lib/catalog/types";
import {fixtureCatalog} from "@/test-utils/fixtures";

function settingsWith(patch: Partial<Settings>): Catalog {
  return {...fixtureCatalog, settings: {...fixtureCatalog.settings, ...patch}};
}

describe("getFaqs", () => {
  it("resolves Sheet tokens in answers", () => {
    const howToPay = getFaqs({group: "payment"}, fixtureCatalog).find((f) => f.id === "how-to-pay");
    expect(howToPay?.answer).toContain("Fixture Bank PLC");
    expect(howToPay?.answer).toContain("0123456789");
  });

  it("resolves the site city token", () => {
    const item = getFaqs({group: "delivery"}, fixtureCatalog).find((f) => f.id === "delivery-areas");
    expect(item?.answer).toContain("across [City]");
    expect(item?.answer).not.toContain("{");
  });

  it("omits the bank question when the Sheet has no bank details", () => {
    const cat = settingsWith({bank: null});
    const payment = getFaqs({group: "payment"}, cat);
    expect(payment.map((f) => f.id)).not.toContain("how-to-pay");
    expect(payment.map((f) => f.id)).toContain("when-to-pay");
  });

  it("omits pickup when there is no pickup address, loyalty when null", () => {
    const cat = settingsWith({pickupAddress: "", loyaltyText: null});
    const all = getFaqs({}, cat);
    expect(all.map((f) => f.id)).not.toContain("pickup");
    expect(all.map((f) => f.id)).not.toContain("loyalty-reward");
  });

  it("filters by page via showOn", () => {
    const seminars = getFaqs({page: "seminars"}, fixtureCatalog);
    expect(seminars.length).toBeGreaterThan(0);
    expect(seminars.every((f) => f.group === "seminars")).toBe(true);
    const faq = getFaqs({page: "faq"}, fixtureCatalog);
    expect(faq.some((f) => f.group === "seminars")).toBe(true);
    expect(faq.some((f) => f.group === "business")).toBe(true);
  });

  it("resolveAnswer returns null on an unknown token", () => {
    expect(resolveAnswer("Call {nonsense} today", fixtureCatalog)).toBeNull();
  });
});

describe("answerInlines", () => {
  it("parses [text](/href) links into inline runs", () => {
    const inlines = answerInlines("See our [delivery and returns policy](/delivery-and-returns). Done.");
    expect(inlines).toEqual([{text: "See our "}, {text: "delivery and returns policy", href: "/delivery-and-returns"}, {text: ". Done."}]);
  });

  it("returns a single run when there are no links", () => {
    expect(answerInlines("Plain answer")).toEqual([{text: "Plain answer"}]);
  });
});

describe("getAbout / getBusinessContent", () => {
  it("resolves {city} in mission and host role", () => {
    const about = getAbout();
    expect(about.mission).toContain("[City]");
    expect(about.mission).not.toContain("{city}");
    expect(about.host.role).toBe("Independent KEDI Distributor in [City]");
  });

  it("excludes unconfirmed support items and resolves {distributorName}", () => {
    const business = getBusinessContent();
    expect(business.support.every((s) => s.confirmed)).toBe(true);
    const names = aboutDistributorName();
    for (const s of business.support) expect(s.text).not.toContain("{distributorName}");
    expect(names).toBeTruthy();
  });
});

function aboutDistributorName() {
  return getAbout().distributor.name;
}

const fakeLegal: LegalEntryLike[] = [
  {
    info: {path: "privacy.mdx"},
    title: "Privacy policy",
    description: "How we handle your data.",
    updated: "2026-01-01",
    body: (() => null) as LegalEntryLike["body"],
    toc: [{title: "Intro", url: "#intro", depth: 2}],
  },
];

describe("getLegalPage", () => {
  it("finds a page by slug and exposes frontmatter", () => {
    const page = getLegalPage("privacy", fakeLegal);
    expect(page?.title).toBe("Privacy policy");
    expect(page?.updated).toBe("2026-01-01");
  });

  it("returns null for an unknown slug", () => {
    expect(getLegalPage("nope", fakeLegal)).toBeNull();
    expect(listLegalSlugs(fakeLegal)).toEqual(["privacy"]);
  });
});

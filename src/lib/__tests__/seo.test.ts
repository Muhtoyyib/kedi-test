import {describe, expect, it} from "vite-plus/test";
import {buildMeta} from "@/lib/seo/meta";
import {breadcrumbLd, localBusinessLd, openingHoursSpec, organizationLd, webSiteLd} from "@/lib/seo/jsonld";
import {articleLd, eventLd, faqLd, productLd} from "@/lib/seo/jsonld-content";
import {buildRobotsTxt, buildSitemapXml, sitemapEntries} from "@/lib/seo/sitemap";
import {catalog} from "@/lib/catalog/data";

const base = "https://shop.example.ng";

function metaContents(meta: {name?: string; property?: string; content?: string}[], key: string): (string | undefined)[] {
  return meta.filter((m) => m.name === key || m.property === key).map((m) => m.content);
}

describe("buildMeta", () => {
  it("emits title, description and a query-free canonical", () => {
    const {meta, links} = buildMeta({title: "Shop | Brand", description: "d", path: "/shop?utm_source=x"});
    expect(meta[0].title).toBe("Shop | Brand");
    expect(metaContents(meta, "description")).toEqual(["d"]);
    expect(links).toHaveLength(0); // no VITE_SITE_URL in test env → no canonical
  });

  it("marks noindex pages", () => {
    const {meta} = buildMeta({title: "t", description: "d", path: "/thank-you/contact", noindex: true});
    expect(metaContents(meta, "robots")).toEqual(["noindex, nofollow"]);
  });

  it("uses the requested og:type", () => {
    const {meta} = buildMeta({title: "t", description: "d", path: "/products/x", type: "product"});
    expect(metaContents(meta, "og:type")).toEqual(["product"]);
  });
});

describe("jsonld", () => {
  it("LocalBusiness carries identity without a KEDI parent", () => {
    const lb = localBusinessLd();
    expect(lb["@type"]).toBe("HealthAndBeautyBusiness");
    expect(lb).not.toHaveProperty("parentOrganization");
    expect((lb.address as {addressCountry: string}).addressCountry).toBe("NG");
    expect(lb).toHaveProperty("telephone");
  });

  it("Organization and WebSite are emitted for every page", () => {
    expect(organizationLd()["@type"]).toBe("Organization");
    expect(webSiteLd()["@type"]).toBe("WebSite");
  });

  it("parses the Sheet opening-hours format to a specification", () => {
    const spec = openingHoursSpec("Mon–Sat, 9:00 AM – 6:00 PM");
    expect(spec).not.toBeNull();
    expect(spec?.opens).toBe("09:00");
    expect(spec?.closes).toBe("18:00");
    expect(spec?.dayOfWeek).toHaveLength(6);
    expect(openingHoursSpec("by appointment")).toBeNull();
  });

  it("Product omits Offer for ask-for-price and marks stock state", () => {
    const priced = catalog.products.find((p) => p.priceNgn !== null && p.inStock)!;
    const ask = catalog.products.find((p) => p.priceNgn === null)!;
    const out = catalog.products.find((p) => !p.inStock && p.priceNgn !== null)!;
    expect((productLd(priced).offers as {price: number}).price).toBe(priced.priceNgn);
    expect(productLd(ask)).not.toHaveProperty("offers");
    expect((productLd(out).offers as {availability: string}).availability).toContain("OutOfStock");
    expect((productLd(priced).brand as {name: string}).name).toBe("KEDI");
  });

  it("Event uses virtual vs place location by format", () => {
    const online = {...catalog.seminars[0], format: "online" as const};
    const physical = {...catalog.seminars[0], format: "physical" as const, venue: "Hall A"};
    expect((eventLd(online).location as Record<string, string>)["@type"]).toBe("VirtualLocation");
    expect(String(eventLd(online).eventAttendanceMode)).toContain("Online");
    expect((eventLd(physical).location as Record<string, string>)["@type"]).toBe("Place");
    expect((eventLd(physical).offers as {price: number}).price).toBe(0);
  });

  it("FAQPage and Article carry their required fields", () => {
    const faq = faqLd([{question: "q", answer: "a"}]);
    expect(faq["@type"]).toBe("FAQPage");
    expect((faq.mainEntity as {name: string}[])[0].name).toBe("q");
    const art = articleLd(catalog.articles[0]);
    expect(art["@type"]).toBe("Article");
    expect(art.headline).toBe(catalog.articles[0].title);
  });

  it("breadcrumb items are positioned", () => {
    const b = breadcrumbLd([
      {name: "Home", path: "/"},
      {name: "Shop", path: "/shop"},
    ]);
    expect((b.itemListElement as {position: number}[]).map((i) => i.position)).toEqual([1, 2]);
  });
});

describe("sitemap and robots", () => {
  it("lists static, product, category and article URLs", () => {
    const entries = sitemapEntries(catalog);
    const paths = entries.map((e) => e.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/shop");
    for (const p of catalog.products) expect(paths).toContain(`/products/${p.slug}`);
    for (const c of catalog.categories) expect(paths).toContain(`/shop/${c.slug}`);
    for (const a of catalog.articles) expect(paths).toContain(`/learn/${a.slug}`);
    expect(paths.some((p) => p.includes("thank-you"))).toBe(false);
  });

  it("emits valid XML with priorities and lastmod", () => {
    const xml = buildSitemapXml(catalog, base);
    expect(xml).toContain("<urlset");
    expect(xml).toContain(`<loc>${base}/shop</loc>`);
    expect(xml).toContain("<priority>0.9</priority>");
  });

  it("robots allows crawling, disallows thank-you, points to the sitemap", () => {
    const txt = buildRobotsTxt(base);
    expect(txt).toContain("Allow: /");
    expect(txt).toContain("Disallow: /thank-you/");
    expect(txt).toContain(`Sitemap: ${base}/sitemap.xml`);
  });
});

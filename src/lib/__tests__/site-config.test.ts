import {describe, expect, it} from "vite-plus/test";
import {getPageTitle, siteConfig, whatsappUrl} from "@/lib/site-config";

describe("getPageTitle", () => {
  it("returns 'brand — tagline' for the home page", () => {
    expect(getPageTitle()).toBe(`${siteConfig.name} — ${siteConfig.tagline}`);
  });

  it("returns '{title} | {brand}' for other pages", () => {
    expect(getPageTitle("Shop KEDI products")).toBe(`Shop KEDI products | ${siteConfig.name}`);
  });
});

describe("siteConfig.whatsapp", () => {
  it("is digits only once the placeholder is filled", () => {
    if (siteConfig.whatsapp.number.startsWith("[")) return;
    expect(siteConfig.whatsapp.number).toMatch(/^\d+$/);
  });
});

describe("whatsappUrl", () => {
  it("builds a wa.me link from the configured number", () => {
    expect(whatsappUrl()).toBe(`https://wa.me/${siteConfig.whatsapp.number}`);
  });

  it("includes the prefilled message", () => {
    expect(whatsappUrl("Hello!")).toContain("?text=Hello%21");
  });
});

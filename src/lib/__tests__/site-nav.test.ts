import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe, expect, it} from "vite-plus/test";
import {footerColumns, isNavActive, legalLinks, mobileNav, primaryNav} from "@/lib/site-nav";

// Every href the shell renders must be a real prerendered route.
const doc = readFileSync(resolve(process.cwd(), "docs/routes-and-sitemap.md"), "utf8");
const routes = new Set([...doc.matchAll(/^\|\s*`(\/[^`]*)`\s*\|/gm)].map((m) => m[1]));

const allLinks = [...primaryNav, ...mobileNav, ...legalLinks, ...footerColumns.flatMap((c) => c.links)];

describe("site-nav", () => {
  it("only links to routes listed in docs/routes-and-sitemap.md", () => {
    for (const link of allLinks) {
      expect(routes.has(link.href), `${link.label} → ${link.href}`).toBe(true);
    }
  });

  it("mobileNav lists every public section in spec order", () => {
    expect(mobileNav.map((l) => l.label)).toEqual([
      "Shop",
      "Seminars",
      "Learn",
      "Customer stories",
      "Business opportunity",
      "Refer a friend",
      "About us",
      "FAQ",
      "Contact",
    ]);
  });

  it("marks exact matches active", () => {
    expect(isNavActive("/about", "/about")).toBe(true);
    expect(isNavActive("/shop", "/shop")).toBe(true);
  });

  it("marks Shop active on category and product pages", () => {
    expect(isNavActive("/shop", "/shop/digestion")).toBe(true);
    expect(isNavActive("/shop", "/products/fixture-product")).toBe(true);
  });

  it("marks Learn active on article pages only", () => {
    expect(isNavActive("/learn", "/learn/some-article")).toBe(true);
    expect(isNavActive("/learn", "/about")).toBe(false);
  });

  it("does not treat shared prefixes as active", () => {
    expect(isNavActive("/about", "/about-us")).toBe(false);
    expect(isNavActive("/shop", "/learn")).toBe(false);
  });
});

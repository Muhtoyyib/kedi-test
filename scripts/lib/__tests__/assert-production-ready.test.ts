import {describe, expect, it} from "vite-plus/test";
import {checkProductionReadiness} from "../production-readiness.ts";

const cleanInput = {
  catalogSource: "live",
  siteConfigSource: 'export const siteConfig = {name: "Acme Wellness"} as const;',
  siteUrl: "https://example.com.ng",
};

describe("checkProductionReadiness", () => {
  it("passes with a live catalog, filled config and https site URL", () => {
    expect(checkProductionReadiness(cleanInput)).toEqual([]);
  });

  it("fails when the catalog came from the fixture", () => {
    const failures = checkProductionReadiness({...cleanInput, catalogSource: "fixture"});
    expect(failures.some((f) => f.includes("fixture"))).toBe(true);
  });

  it("fails when the catalog is missing or unreadable", () => {
    const failures = checkProductionReadiness({...cleanInput, catalogSource: null});
    expect(failures.some((f) => f.includes("catalog.json"))).toBe(true);
  });

  it("fails when site-config still contains a placeholder, naming it", () => {
    const failures = checkProductionReadiness({
      ...cleanInput,
      siteConfigSource: 'export const siteConfig = {name: "[Brand Name]"} as const;',
    });
    expect(failures).toHaveLength(1);
    expect(failures[0]).toContain("[Brand Name]");
  });

  it("fails when VITE_SITE_URL is unset", () => {
    const failures = checkProductionReadiness({...cleanInput, siteUrl: undefined});
    expect(failures.some((f) => f.includes("VITE_SITE_URL"))).toBe(true);
  });

  it("fails when VITE_SITE_URL is not https", () => {
    const failures = checkProductionReadiness({...cleanInput, siteUrl: "http://example.com.ng"});
    expect(failures.some((f) => f.includes("https"))).toBe(true);
  });
});

import {describe, expect, it} from "vitest";
import {slugify} from "../slugify.ts";

describe("slugify", () => {
  it("folds accents to ASCII", () => {
    expect(slugify("Àdánmá's Herbal Tea")).toBe("adanmas-herbal-tea");
    expect(slugify("Café Énergie")).toBe("cafe-energie");
  });

  it("strips symbols and apostrophes", () => {
    expect(slugify("Men's Health + Vitality!")).toBe("mens-health-vitality");
    expect(slugify("Oil (50%) — 100ml")).toBe("oil-50-100ml");
  });

  it("collapses repeated hyphens and trims edges", () => {
    expect(slugify("a  --  b")).toBe("a-b");
    expect(slugify("--Hello--World--")).toBe("hello-world");
  });

  it("keeps numbers", () => {
    expect(slugify("Fixture Product 500mg v2")).toBe("fixture-product-500mg-v2");
  });

  it("handles empty and symbol-only input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("!!!")).toBe("");
  });
});

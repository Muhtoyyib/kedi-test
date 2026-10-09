import {describe, expect, it} from "vitest";
import {bannedWordsIn, checkCompliance} from "../compliance.ts";
import {parseCatalog} from "../parse-catalog.ts";
import fixture from "../../fixtures/catalog.fixture.json";

describe("bannedWordsIn", () => {
  it("matches whole words only — 'secure' is not 'cure'", () => {
    expect(bannedWordsIn("This secure routine suits me")).toEqual([]);
    expect(bannedWordsIn("It cured my tiredness")).toEqual(["cured"]);
  });

  it("is case-insensitive and dedupes", () => {
    expect(bannedWordsIn("CURE Cure cure")).toEqual(["cure"]);
    expect(bannedWordsIn("Diabetes and DIABETES")).toEqual(["diabetes"]);
  });
});

describe("checkCompliance", () => {
  it("passes the shipped fixture (clean copy)", () => {
    expect(checkCompliance(parseCatalog(fixture))).toEqual([]);
  });

  it("flags banned words in story quote/fullStory and highlight comments", () => {
    const c = parseCatalog(fixture);
    c.stories.find((s) => s.id === "FX-S1")!.quote = "It cured my fatigue";
    c.highlights.find((h) => h.id === "FX-H1")!.comment = {text: "this miracle worked", name: "X Y."};
    const errors = checkCompliance(c);
    expect(errors.join("\n")).toContain('Stories (FX-S1): banned word "cured"');
    expect(errors.join("\n")).toContain('Highlights (FX-H1): banned word "miracle"');
  });

  it("flags article body text but exempts the doctor callout", () => {
    const c = parseCatalog(fixture);
    // Fixture FX-A1's doctor-callout legitimately says "diabetes" — exempt.
    expect(checkCompliance(c)).toEqual([]);
    c.articles[0]!.body.push({type: "p", inlines: [{text: "it cures ulcers"}]});
    const errors = checkCompliance(c);
    expect(errors.join("\n")).toContain('Articles (FX-A1): banned word "cures"');
    expect(errors.join("\n")).toContain('Articles (FX-A1): banned word "ulcers"');
  });
});

import {readFileSync} from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {EARNINGS_DISCLAIMER, HEALTH_DISCLAIMER, lintContent, lintLegalFrontmatter} from "../content-lint.ts";

const root = path.resolve(import.meta.dirname, "../../..");
const read = (p: string) => ({path: p, text: readFileSync(path.join(root, p), "utf8")});

describe("lintContent", () => {
  it("flags a banned claim word in faq.ts", () => {
    const files = [{path: "content/faq.ts", text: 'answer: "This product cures headaches."'}];
    const findings = lintContent(files);
    expect(findings).toEqual([{path: "content/faq.ts", line: 1, word: "cures"}]);
  });

  it("reports the file and line of each finding", () => {
    const files = [{path: "content/faq.ts", text: "line one\nthis treats colds\nline three"}];
    expect(lintContent(files)).toEqual([{path: "content/faq.ts", line: 2, word: "treats"}]);
  });

  it("allows the exact health disclaimer text", () => {
    const files = [{path: "content/faq.ts", text: `answer: "${HEALTH_DISCLAIMER}"`}];
    expect(lintContent(files)).toEqual([]);
  });

  it("skips the health-disclaimer legal page (it names disease to disclaim it)", () => {
    const files = [{path: "content/legal/health-disclaimer.mdx", text: "Not intended to treat any disease such as diabetes."}];
    expect(lintContent(files)).toEqual([]);
  });

  it("applies the income-language list to business.ts", () => {
    const files = [{path: "content/business.ts", text: 'text: "Earn ₦50,000 per month in passive income."'}];
    const words = lintContent(files).map((f) => f.word);
    expect(words).toContain("per month");
    expect(words).toContain("income");
    expect(words.some((w) => w.startsWith("₦"))).toBe(true);
  });

  it("allows the exact earnings disclaimer in business.ts", () => {
    const files = [{path: "content/business.ts", text: `disclaimer: "${EARNINGS_DISCLAIMER}"`}];
    expect(lintContent(files)).toEqual([]);
  });

  it("does not apply the income list to faq.ts (business answers deny earnings)", () => {
    const files = [{path: "content/faq.ts", text: 'answer: "We do not promise any income."'}];
    expect(lintContent(files)).toEqual([]);
  });

  it("passes the real repo content", () => {
    const files = [read("content/faq.ts"), read("content/business.ts")];
    expect(lintContent(files)).toEqual([]);
  });
});

describe("lintLegalFrontmatter", () => {
  const good = "---\ntitle: Privacy policy\ndescription: How we handle data.\nupdated: '2026-01-01'\n---\n\nBody.\n";

  it("fails naming the file and missing field", () => {
    const bad = "---\ntitle: Privacy policy\ndescription: How we handle data.\n---\n\nBody.\n";
    const findings = lintLegalFrontmatter([{path: "content/legal/privacy.mdx", text: bad}]);
    expect(findings).toEqual([{path: "content/legal/privacy.mdx", line: 1, word: "frontmatter: missing or invalid updated"}]);
  });

  it("fails when description exceeds 155 chars", () => {
    const bad = `---\ntitle: T\ndescription: ${"x".repeat(160)}\nupdated: '2026-01-01'\n---\n`;
    expect(lintLegalFrontmatter([{path: "content/legal/t.mdx", text: bad}])).toHaveLength(1);
  });

  it("passes a complete frontmatter block and ignores non-legal files", () => {
    expect(lintLegalFrontmatter([{path: "content/legal/privacy.mdx", text: good}])).toEqual([]);
    expect(lintLegalFrontmatter([{path: "content/faq.ts", text: "no frontmatter"}])).toEqual([]);
  });
});

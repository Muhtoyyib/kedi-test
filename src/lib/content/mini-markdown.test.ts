import {describe, expect, it} from "vite-plus/test";
import {parseMiniMarkdown} from "./mini-markdown";

describe("parseMiniMarkdown", () => {
  it("returns a single plain paragraph for text without markup", () => {
    expect(parseMiniMarkdown("Hello there.")).toEqual([[{text: "Hello there."}]]);
  });

  it("parses **bold** runs", () => {
    expect(parseMiniMarkdown("Pay **after** we confirm.")).toEqual([[{text: "Pay "}, {text: "after", bold: true}, {text: " we confirm."}]]);
  });

  it("parses [text](href) links", () => {
    expect(parseMiniMarkdown("See [delivery fees](/delivery-and-returns) for details.")).toEqual([
      [{text: "See "}, {text: "delivery fees", href: "/delivery-and-returns"}, {text: " for details."}],
    ]);
  });

  it("splits paragraphs on newlines", () => {
    expect(parseMiniMarkdown("First.\n\nSecond.")).toEqual([[{text: "First."}], [{text: "Second."}]]);
  });

  it("keeps raw HTML as text — never markup", () => {
    expect(parseMiniMarkdown("<script>alert(1)</script>")).toEqual([[{text: "<script>alert(1)</script>"}]]);
  });
});

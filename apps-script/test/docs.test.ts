import {describe, expect, it} from "vitest";
import {convertDocNodes, type DocNode} from "../src/docs.ts";

const para = (runs: {text: string; bold?: boolean; italic?: boolean; href?: string | null}[], images: {alt: string}[] = []): DocNode => ({
  type: "para",
  heading: "normal",
  runs,
  images,
});
const h = (heading: "title" | "h1" | "h2" | "h3", text: string): DocNode => ({type: "para", heading, runs: [{text}], images: []});
const li = (ordered: boolean, text: string): DocNode => ({type: "li", ordered, runs: [{text}]});

const convert = (nodes: DocNode[]) => convertDocNodes("doc1", "ART-001", nodes);

describe("convertDocNodes", () => {
  it("uses the first title/heading1 as the article title", () => {
    const {title, blocks} = convert([h("title", "Eating well every day"), para([{text: "Intro."}])]);
    expect(title).toBe("Eating well every day");
    expect(blocks).toEqual([{type: "p", inlines: [{text: "Intro."}]}]);
  });

  it("converts h2/h3 with slugged ids", () => {
    const {blocks} = convert([h("h2", "Morning habits"), h("h3", "Drink water"), para([{text: "Details."}])]);
    expect(blocks[0]).toEqual({type: "h2", id: "morning-habits", text: "Morning habits"});
    expect(blocks[1]).toEqual({type: "h3", id: "drink-water", text: "Drink water"});
  });

  it("keeps bold, italic and safe links; drops unsafe schemes", () => {
    const {blocks} = convert([
      para([
        {text: "Read ", href: null},
        {text: "this guide", bold: true, href: "https://example.com"},
        {text: " and ", italic: true},
        {text: "this", href: "javascript:alert(1)"},
        {text: " or "},
        {text: "that", href: "ftp://x"},
      ]),
    ]);
    const p = blocks[0] as {inlines: {text: string; bold?: boolean; italic?: boolean; href?: string}[]};
    expect(p.inlines.find((i) => i.text === "this guide")).toMatchObject({bold: true, href: "https://example.com"});
    expect(p.inlines.every((i) => !i.href || i.href.startsWith("http") || i.href.startsWith("mailto:"))).toBe(true);
    expect(p.inlines.map((i) => i.text).join("")).toContain("this");
  });

  it("groups consecutive list items into ul/ol", () => {
    const {blocks} = convert([li(false, "one"), li(false, "two"), li(true, "first"), li(true, "second"), para([{text: "after"}])]);
    expect(blocks[0]).toEqual({type: "ul", items: [[{text: "one"}], [{text: "two"}]]});
    expect(blocks[1]).toEqual({type: "ol", items: [[{text: "first"}], [{text: "second"}]]});
    expect(blocks[2].type).toBe("p");
  });

  it("emits image blocks with doc refs and warns on missing alt", () => {
    const {blocks, warnings} = convert([para([{text: ""}], [{alt: "Two people smiling"}]), para([{text: ""}], [{alt: ""}])]);
    expect(blocks[0]).toEqual({type: "image", ref: {doc: "doc1", n: 0}, alt: "Two people smiling"});
    expect(blocks[1]).toEqual({type: "image", ref: {doc: "doc1", n: 1}, alt: ""});
    expect(warnings.some((w) => w.includes("image 2"))).toBe(true);
  });

  it("turns a lone video link into a video block", () => {
    const url = "https://youtu.be/abc123XYZ";
    const {blocks} = convert([para([{text: url}])]);
    expect(blocks[0]).toEqual({type: "video", video: {provider: "youtube", id: "abc123XYZ", url}});
  });

  it("collects blocks into the doctor callout until the next h2", () => {
    const {blocks} = convert([
      para([{text: "before"}]),
      h("h2", "When to see a doctor"),
      para([{text: "If symptoms persist, see a doctor about your ulcer."}]),
      para([{text: "Call if it gets worse."}]),
      h("h2", "Next section"),
      para([{text: "after"}]),
    ]);
    expect(blocks[1].type).toBe("doctor-callout");
    const callout = blocks[1] as {blocks: {type: string}[]};
    expect(callout.blocks).toHaveLength(2);
    expect(blocks[2]).toMatchObject({type: "h2", text: "Next section"});
  });

  it("ignores tables with a warning", () => {
    const {blocks, warnings} = convert([para([{text: "a"}]), {type: "unsupported", what: "TABLE"}, para([{text: "b"}])]);
    expect(blocks).toHaveLength(2);
    expect(warnings.some((w) => w.includes("tables aren't shown"))).toBe(true);
  });

  it("errors on banned words outside the callout, not inside", () => {
    const {errors} = convert([
      para([{text: "This habit cures it."}]),
      h("h2", "When to see a doctor"),
      para([{text: "An ulcer needs a doctor."}]),
    ]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain("cures");
    expect(errors[0]).toContain("ART-001");
  });

  it("computes reading minutes at 200 words/min, min 1", () => {
    const long = "word ".repeat(450).trim();
    expect(convert([para([{text: long}])]).readingMinutes).toBe(3);
    expect(convert([para([{text: "short"}])]).readingMinutes).toBe(1);
  });
});

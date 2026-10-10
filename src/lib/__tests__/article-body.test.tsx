import {render, screen} from "@testing-library/react";
import type {ReactNode} from "react";
import {describe, expect, it, vi} from "vitest";
import {ArticleBody} from "@/components/content/article-body";
import {RichText} from "@/components/content/rich-text";
import {getArticle} from "@/lib/catalog/articles";
import {fixtureCatalog} from "@/test-utils/fixtures";
import type {ArticleBlock} from "@/lib/catalog/types";

// Link needs router context — stub it as a plain anchor for these tests.
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tanstack/react-router")>();
  return {...mod, Link: ({to, children}: {to: string; children: ReactNode}) => <a href={to}>{children}</a>};
});

const article = getArticle("fixture-everyday-gut-guide", fixtureCatalog);
const blocks = article?.body ?? [];

describe("ArticleBody", () => {
  it("renders headings with ids and a hover anchor on h2", () => {
    const {container} = render(<ArticleBody blocks={blocks} />);
    const h2 = container.querySelector("h2");
    expect(h2?.id).toBeTruthy();
    expect(h2?.querySelector(`a[href="#${h2.id}"]`)).toBeTruthy();
    expect(container.querySelector("h3")?.id).toBeTruthy();
  });

  it("renders inline marks and links", () => {
    const p: ArticleBlock = {
      type: "p",
      inlines: [
        {text: "A "},
        {text: "bold", bold: true},
        {text: " and "},
        {text: "em", italic: true},
        {text: " link ", href: "https://example.com"},
        {text: "internal", href: "/shop"},
      ],
    };
    const {container} = render(<ArticleBody blocks={[p]} />);
    expect(container.querySelector("strong")?.textContent).toBe("bold");
    expect(container.querySelector("em")?.textContent).toBe("em");
    const ext = container.querySelector('a[href="https://example.com"]');
    expect(ext).toHaveAttribute("target", "_blank");
    expect(ext).toHaveAttribute("rel", "noopener");
    expect(container.querySelector('a[href="/shop"]')).toBeTruthy();
  });

  it("renders lists", () => {
    const {container} = render(<ArticleBody blocks={blocks} />);
    expect(container.querySelector("ul li")).toBeTruthy();
    expect(container.querySelector("ol li")).toBeTruthy();
  });

  it("renders an image figure; long alt becomes a caption", () => {
    const image = blocks.find((b) => b.type === "image");
    const {container} = render(<ArticleBody blocks={image ? [image] : []} />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.alt).toBeTruthy();
  });

  it("renders the video as a facade, not an iframe", () => {
    const video = blocks.find((b) => b.type === "video");
    const {container} = render(<ArticleBody blocks={video ? [video] : []} />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getByRole("button", {name: /play video/i})).toBeInTheDocument();
  });

  it("renders the doctor callout as a titled notice", () => {
    render(<ArticleBody blocks={blocks} />);
    expect(screen.getByText("When to see a doctor")).toBeInTheDocument();
  });

  it("shows <script> text literally — never as markup", () => {
    const p: ArticleBlock = {type: "p", inlines: [{text: "<script>alert(1)</script>"}]};
    const {container} = render(<ArticleBody blocks={[p]} />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain("<script>alert(1)</script>");
  });

  it("skips unknown block types at runtime", () => {
    const unknown = JSON.parse('{"type":"mystery","inlines":[{"text":"x"}]}') as ArticleBlock;
    const {container} = render(<ArticleBody blocks={[unknown]} />);
    expect(container.textContent).not.toContain("x");
  });
});

describe("RichText", () => {
  it("renders story paragraphs as plain text", () => {
    render(<RichText paragraphs={["First paragraph.", "Second with <b>no marks</b>."]} />);
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second with <b>no marks</b>.")).toBeInTheDocument();
  });
});

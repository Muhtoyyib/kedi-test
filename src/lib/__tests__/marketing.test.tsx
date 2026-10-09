import {describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import {SectionHeader} from "@/components/marketing/section-header";
import {Reveal} from "@/components/marketing/reveal";

describe("SectionHeader", () => {
  it("uses the requested heading level", () => {
    render(<SectionHeader as="h1" title="Wellness made simple" />);
    expect(screen.getByRole("heading", {level: 1, name: "Wellness made simple"})).toBeInTheDocument();
  });

  it("defaults to h2 with eyebrow and description", () => {
    render(<SectionHeader eyebrow="This week" title="Free seminar" description="Learn the basics." />);
    expect(screen.getByRole("heading", {level: 2, name: "Free seminar"})).toBeInTheDocument();
    expect(screen.getByText("This week")).toBeInTheDocument();
    expect(screen.getByText("Learn the basics.")).toBeInTheDocument();
  });
});

describe("Reveal", () => {
  it("renders children without entrance motion under prefers-reduced-motion", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        onchange: null,
        dispatchEvent: () => false,
      } as MediaQueryList)
    );

    const {container} = render(
      <Reveal>
        <p>Hello</p>
      </Reveal>
    );
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveTextContent("Hello");
    expect(wrapper?.getAttribute("style") ?? "").not.toContain("opacity: 0");
  });
});

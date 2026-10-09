import {describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {VideoEmbed} from "@/components/ui/video-embed";
import {track} from "@/lib/analytics/track";
import type {GeneratedImage} from "@/lib/catalog/types";

vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));

const image: GeneratedImage = {
  key: "p/KD-F001/0",
  alt: "Fixture Product A — 60 capsules",
  width: 1200,
  height: 1200,
  variants: [
    {width: 320, avif: "/media/p/KD-F001/0-320.avif", webp: "/media/p/KD-F001/0-320.webp"},
    {width: 768, avif: "/media/p/KD-F001/0-768.avif", webp: "/media/p/KD-F001/0-768.webp"},
    {width: 1200, avif: "/media/p/KD-F001/0-1200.avif", webp: "/media/p/KD-F001/0-1200.webp"},
  ],
};

describe("ResponsiveImage", () => {
  it("renders AVIF and WebP srcsets with intrinsic dimensions", () => {
    const {container} = render(<ResponsiveImage image={image} sizes="(max-width: 768px) 100vw, 50vw" />);
    const sources = container.querySelectorAll("source");
    expect(sources[0]).toHaveAttribute("type", "image/avif");
    expect(sources[0].getAttribute("srcset")).toContain("/media/p/KD-F001/0-320.avif 320w");
    expect(sources[1].getAttribute("srcset")).toContain("0-1200.webp 1200w");

    const img = screen.getByAltText("Fixture Product A — 60 capsules");
    expect(img).toHaveAttribute("src", "/media/p/KD-F001/0-768.webp");
    expect(img).toHaveAttribute("width", "1200");
    expect(img).toHaveAttribute("height", "1200");
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("priority images load eagerly with high fetch priority", () => {
    render(<ResponsiveImage image={image} sizes="100vw" priority />);
    const img = screen.getByAltText("Fixture Product A — 60 capsules");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });

  it("renders the branded placeholder box when the image has no variants", () => {
    const {container} = render(<ResponsiveImage image={{...image, variants: []}} sizes="100vw" />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Fixture Product A — 60 capsules")).toBeInTheDocument();
  });
});

describe("VideoEmbed", () => {
  it("renders a facade and loads no iframe until tapped", async () => {
    const user = userEvent.setup();
    const {container} = render(<VideoEmbed provider="youtube" id="abc123" title="How to use Product A" location="learn_hub" />);
    expect(container.querySelector("iframe")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", {name: "Play video: How to use Product A"}));

    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/abc123?autoplay=1");
    expect(track).toHaveBeenCalledWith({event: "video_play", provider: "youtube", location: "learn_hub"});
  });
});

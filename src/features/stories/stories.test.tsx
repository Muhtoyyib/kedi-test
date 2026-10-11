import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {getStories} from "@/lib/catalog/stories";
import {siteConfig} from "@/lib/site-config";
import {ShareYourStory} from "./components/share-your-story";
import {StoriesIntro} from "./components/stories-intro";
import {VideoStories} from "./components/video-stories";
import {WrittenStories} from "./components/written-stories";
import {StoriesView} from "./view";

const stories = getStories();
const written = stories.filter((s) => s.kind === "written");
const video = stories.filter((s) => s.kind === "video");

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
});

describe("StoriesIntro", () => {
  it("renders the exact intro copy and consent note", () => {
    render(<StoriesIntro />);
    expect(screen.getByRole("heading", {level: 1, name: "In our customers' words"})).toBeInTheDocument();
    expect(screen.getByText("Customer stories")).toBeInTheDocument();
    expect(
      screen.getByText(
        `Real customers in ${siteConfig.city} on what it's like to buy from us: the guidance, the follow-up and the service.`
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/shared with the customer's written permission/)).toBeInTheDocument();
    expect(screen.getByText(/not medical advice, and individual experiences vary/)).toBeInTheDocument();
  });

  it("swaps the description for the empty variant", () => {
    render(<StoriesIntro empty />);
    expect(screen.getByText(/Our first customer stories are on the way/)).toBeInTheDocument();
    expect(screen.getByText(/written permission/)).toBeInTheDocument();
  });
});

describe("WrittenStories", () => {
  it("lists every written story featured first, each with a slug anchor", () => {
    const {container} = render(<WrittenStories stories={written} />);
    const cards = [...container.querySelectorAll("article[id]")];
    expect(cards.map((c) => c.id)).toEqual(written.map((s) => s.slug));
    expect(cards[0].id).toBe("fx-s1"); // featured story first
    expect(cards[0].className).toContain("scroll-mt-24");
  });

  it("collapses long stories behind Read full story", async () => {
    const long = written.find((s) => s.fullStory.length > 1)!;
    render(<WrittenStories stories={[long]} />);
    const summary = screen.getByText("Read full story");
    const details = summary.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    await userEvent.setup().click(summary);
    expect(details).toHaveAttribute("open");
    for (const paragraph of long.fullStory) expect(screen.getByText(paragraph)).toBeInTheDocument();
  });

  it("renders nothing when there are no written stories", () => {
    const {container} = render(<WrittenStories stories={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("VideoStories", () => {
  it("renders nothing when there are no video stories", () => {
    const {container} = render(<VideoStories stories={written} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders facades with name, area and quote — no iframes until tapped", () => {
    render(<VideoStories stories={stories} />);
    expect(screen.getByRole("heading", {name: "Watch their stories"})).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
    const emeka = video[0];
    expect(screen.getByText(`${emeka.name} · ${emeka.area}`)).toBeInTheDocument();
    expect(screen.getByText(emeka.quote)).toBeInTheDocument();
    expect(document.getElementById(emeka.slug)).toBeInTheDocument();
  });
});

describe("ShareYourStory", () => {
  it("renders the exact copy and the story submission WhatsApp link", () => {
    render(<ShareYourStory />);
    expect(screen.getByRole("heading", {name: "Bought from us? Share your experience"})).toBeInTheDocument();
    const link = screen.getByRole("link", {name: "Share on WhatsApp"});
    expect(link.getAttribute("href")).toContain("wa.me");
    expect(decodeURIComponent(link.getAttribute("href")!).replace(/\+/g, " ")).toContain(
      "I'd like to share my experience with your service."
    );
    expect(screen.getByRole("link", {name: "Shop products"})).toHaveAttribute("href", "/shop");
  });
});

describe("StoriesView", () => {
  it("renders all sections with the fixture stories", () => {
    render(<StoriesView />);
    expect(screen.getByRole("heading", {level: 1, name: "In our customers' words"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Watch their stories"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Bought from us? Share your experience"})).toBeInTheDocument();
    for (const story of written) expect(document.getElementById(story.slug)).toBeInTheDocument();
  });

  it("renders only intro and CTA when no stories are published", () => {
    render(<StoriesView stories={[]} />);
    expect(screen.getByText(/Our first customer stories are on the way/)).toBeInTheDocument();
    expect(screen.queryByRole("heading", {name: "Watch their stories"})).not.toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Bought from us? Share your experience"})).toBeInTheDocument();
  });
});

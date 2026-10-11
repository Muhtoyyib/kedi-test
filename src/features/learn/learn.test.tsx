import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {getArticle, getArticles} from "@/lib/catalog/articles";
import {catalog} from "@/lib/catalog/data";
import type {Article} from "@/lib/catalog/types";
import {getVideos} from "@/lib/catalog/videos";
import {ArticleCta} from "./components/article-cta";
import {ArticleGrid} from "./components/article-grid";
import {ArticleView} from "./components/article-view";
import {HubHeader} from "./components/hub-header";
import {TopicFilter} from "./components/topic-filter";
import {VideoLibrary} from "./components/video-library";
import {validateLearnSearch} from "./use-learn-topic";

const articles = getArticles();
const gutGuide = getArticle("fixture-everyday-gut-guide")!;

function cloneArticle(id: string, date: string): Article {
  return {...gutGuide, id, slug: id, title: `Article ${id}`, date};
}

function intersecting() {
  window.IntersectionObserver = class {
    constructor(private cb: IntersectionObserverCallback) {}
    observe(el: Element) {
      this.cb([{isIntersecting: true, target: el} as IntersectionObserverEntry], this as never);
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as never;
}

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
});

describe("HubHeader", () => {
  it("renders the h1 and the newest article as featured", () => {
    render(<HubHeader featured={articles[0]} />);
    expect(screen.getByRole("heading", {level: 1, name: "Practical wellness, in plain language"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Read article"})).toHaveAttribute("href", `/learn/${articles[0].slug}`);
    expect(screen.getAllByRole("link", {name: new RegExp(articles[0].title)}).length).toBeGreaterThan(0);
  });

  it("hides the featured card when no article is passed (topic filter active)", () => {
    render(<HubHeader />);
    expect(screen.getByRole("heading", {level: 1})).toBeInTheDocument();
    expect(screen.queryByRole("link", {name: "Read article"})).not.toBeInTheDocument();
  });
});

describe("TopicFilter", () => {
  it("shows chips only for topics that have articles", () => {
    render(
      <TopicFilter
        counts={[
          {topic: "digestion", count: 1},
          {topic: "energy", count: 1},
          {topic: "everyday-wellness", count: 1},
        ]}
        value={null}
        onChange={() => {}}
      />
    );
    expect(screen.getByRole("button", {name: "All"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Digestion (1)"})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Energy (1)"})).toBeInTheDocument();
    expect(screen.queryByRole("button", {name: /Weight/})).not.toBeInTheDocument();
  });

  it("reports the chosen topic via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TopicFilter counts={[{topic: "digestion", count: 1}]} value={null} onChange={onChange} />);
    await user.click(screen.getByRole("button", {name: "Digestion (1)"}));
    expect(onChange).toHaveBeenCalledWith("digestion");
  });

  it("treats unknown topic search values as All", () => {
    expect(validateLearnSearch({topic: "digestion"})).toEqual({topic: "digestion"});
    expect(validateLearnSearch({topic: "unknown"})).toEqual({topic: undefined});
    expect(validateLearnSearch({})).toEqual({topic: undefined});
  });
});

describe("ArticleGrid", () => {
  it("lists articles newest first", () => {
    render(<ArticleGrid articles={articles} />);
    const links = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(links).toContain(`/learn/${articles[0].slug}`);
  });

  it("reveals the next 12 articles on Show more", async () => {
    const many = Array.from({length: 15}, (_, i) => cloneArticle(`a${i}`, `2026-10-${String(i + 1).padStart(2, "0")}`));
    render(<ArticleGrid articles={many} />);
    const items = () => screen.getAllByRole("listitem");
    // Before hydration all 15 render; once hydrated only the first 12 show.
    await screen.findByRole("button", {name: "Show more articles"});
    expect(items().filter((li) => !li.classList.contains("hidden"))).toHaveLength(12);
    await userEvent.setup().click(screen.getByRole("button", {name: "Show more articles"}));
    expect(items().filter((li) => !li.classList.contains("hidden"))).toHaveLength(15);
    expect(screen.queryByRole("button", {name: "Show more articles"})).not.toBeInTheDocument();
  });

  it("shows the coming-soon state with a seminar link when empty", () => {
    render(<ArticleGrid articles={[]} />);
    expect(screen.getByText(/Articles are coming soon/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "join our free seminar"})).toHaveAttribute("href", "/seminars");
  });
});

describe("VideoLibrary", () => {
  it("renders nothing when the video list is empty", () => {
    const {container} = render(<VideoLibrary videos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders facades with titles and no iframes until tapped", () => {
    render(<VideoLibrary videos={getVideos()} />);
    expect(screen.getByRole("heading", {name: "Watch and learn"})).toBeInTheDocument();
    expect(screen.getAllByRole("button", {name: /^Play video/}).length).toBe(getVideos().length);
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText("Fixture — Behind the stall")).toBeInTheDocument();
  });

  it("loads only the tapped facade's iframe", async () => {
    const user = userEvent.setup();
    render(<VideoLibrary videos={getVideos()} />);
    await user.click(screen.getByRole("button", {name: "Play video: Fixture — Behind the stall"}));
    const iframes = document.querySelectorAll("iframe");
    expect(iframes).toHaveLength(1);
    expect(iframes[0].src).toContain("tiktok.com/embed");
    expect(window.gtag).toHaveBeenCalledWith("event", "video_play", expect.objectContaining({location: "learn_hub", provider: "tiktok"}));
  });
});

describe("ArticleCta", () => {
  const next = catalog.seminars.find((s) => new Date(s.startsAt) > new Date(catalog.generatedAt));

  it("renders the three actions", () => {
    render(<ArticleCta article={gutGuide} />);
    expect(screen.getByRole("heading", {name: "Want to go further?"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Register free"})).toHaveAttribute("href", "/seminars#register");
    expect(screen.getByRole("link", {name: "View products"})).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", {name: "Chat with us"}).getAttribute("href")).toContain("wa.me");
  });

  it("includes the next seminar date in the line when scheduled", () => {
    render(<ArticleCta article={gutGuide} nextSeminar={next} />);
    expect(screen.getByText(/Ask questions at our free seminar on \w+, \d+ \w+/)).toBeInTheDocument();
  });

  it("omits the date when no seminar is scheduled", () => {
    render(<ArticleCta article={gutGuide} />);
    expect(screen.getByText("Ask questions at our free seminar")).toBeInTheDocument();
  });

  it("links to the related category shop page when set", () => {
    const category = catalog.categories.find((c) => c.slug === gutGuide.relatedCategory);
    render(<ArticleCta article={gutGuide} category={category} />);
    expect(screen.getByText(`See products for ${category!.name}`)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "View products"})).toHaveAttribute("href", `/shop/${category!.slug}`);
  });

  it("tracks the register and chat clicks with article context", async () => {
    const user = userEvent.setup();
    render(<ArticleCta article={gutGuide} nextSeminar={next} />);
    await user.click(screen.getByRole("link", {name: "Register free"}));
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "seminar_register_click",
      expect.objectContaining({location: "article_cta", seminar_id: next!.id})
    );
    await user.click(screen.getByRole("link", {name: "Chat with us"}));
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "whatsapp_chat_click",
      expect.objectContaining({location: "article_cta", context: gutGuide.slug})
    );
  });
});

describe("ArticleView", () => {
  it("renders header meta, disclaimer and related sections", () => {
    render(<ArticleView article={gutGuide} />);
    expect(screen.getByRole("heading", {level: 1, name: gutGuide.title})).toBeInTheDocument();
    expect(screen.getByText(/By the \[Brand Name\] team · 5 October 2026 ·/)).toBeInTheDocument();
    expect(screen.getByText(/not intended to diagnose, treat, cure or prevent/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: /Explore our .* range/})).toHaveAttribute("href", `/shop/${gutGuide.relatedCategory}`);
    expect(screen.getByRole("heading", {name: "More on Digestion"})).toBeInTheDocument();
  });

  it("omits the related-category link when the article has none", () => {
    render(<ArticleView article={{...gutGuide, relatedCategory: null}} />);
    expect(screen.queryByRole("link", {name: /Explore our .* range/})).not.toBeInTheDocument();
  });

  it("shows On this page only when the article has 3+ headings", () => {
    const {unmount} = render(<ArticleView article={gutGuide} />);
    expect(screen.queryByText("On this page")).not.toBeInTheDocument(); // fixture has 2 h2s
    unmount();
    const long = {
      ...gutGuide,
      toc: [
        {id: "a", text: "A"},
        {id: "b", text: "B"},
        {id: "c", text: "C"},
      ],
    };
    render(<ArticleView article={long} />);
    expect(screen.getAllByText("On this page").length).toBeGreaterThan(0);
  });

  it("fires article_read once when the 75% sentinel intersects", () => {
    intersecting();
    render(<ArticleView article={gutGuide} />);
    expect(window.gtag).toHaveBeenCalledWith("event", "article_read", {slug: gutGuide.slug, topic: gutGuide.topic});
    const reads = vi.mocked(window.gtag!).mock.calls.filter((args) => args[1] === "article_read");
    expect(reads).toHaveLength(1);
  });
});

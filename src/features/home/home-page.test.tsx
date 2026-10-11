import {describe, expect, it, vi} from "vite-plus/test";
import {fireEvent, render, screen} from "@testing-library/react";
import {getArticles} from "@/lib/catalog/articles";
import {getFeaturedProducts} from "@/lib/catalog/products";
import {getNextSeminar, getSeminars} from "@/lib/catalog/seminars";
import {getStories} from "@/lib/catalog/stories";
import {ArticleCard} from "@/components/marketing/article-card";
import {SeminarCard} from "@/components/marketing/seminar-card";
import {StoryCard} from "@/components/marketing/story-card";
import {ToastProvider} from "@/components/ui/toast";
import {siteConfig} from "@/lib/site-config";
import {FeaturedProducts} from "./components/featured-products";
import {NextSeminarBanner} from "./components/next-seminar-banner";
import {StoriesPreview} from "./components/stories-preview";
import {WellnessHubPreview} from "./components/wellness-hub-preview";
import {HomeView} from "./view";

vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));
// Pin components to the prerender path so `buildNow` decides the seminar
// state deterministically (the hydrated path would use the wall clock).
vi.mock("@/lib/use-hydrated", () => ({useHydrated: () => false}));
import {track} from "@/lib/analytics/track";

const SEM_NEXT = getSeminars().find((s) => s.id === "SEM-NEXT")!;

const SECTION_FRAGMENTS = [
  "Independent KEDI Distributor",
  "Your trusted KEDI wellness partner",
  "Shop products",
  "Not sure what you need? Chat with us on WhatsApp",
  "Genuine KEDI products",
  "Free wellness seminars",
  "Personal follow-up",
  `Delivery across ${siteConfig.city}`,
  "More than a stockist",
  "Learn before you buy",
  "Help choosing",
  "We check in",
  "Free weekly seminars",
  "Reliable service",
  "Featured products",
  "Energy Through the Week",
  "What our customers say",
  "Learn something useful",
  "Not sure what you need?",
  "Join the free seminar",
  "Delivering across [Area 1], [Area 2], [Area 3] and beyond",
] as const;

describe("SeminarCard banner", () => {
  it("renders date block, topic, time range, venue and register link", () => {
    render(
      <SeminarCard
        seminar={SEM_NEXT}
        variant="banner"
        registerHref="/seminars#register"
        location="home_banner"
        now={new Date("2026-10-10T12:00:00+01:00")}
      />
    );
    expect(screen.getByText("Next free seminar")).toBeInTheDocument();
    expect(screen.getByText("Fixture — Energy Through the Week")).toBeInTheDocument();
    expect(screen.getByText(/WAT/)).toBeInTheDocument();
    expect(screen.getByText("Fixture Hall, Surulere")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Register free"})).toHaveAttribute("href", "/seminars#register");
    expect(screen.getByRole("link", {name: /See all seminars/})).toHaveAttribute("href", "/seminars");
  });

  it("tracks seminar_register_click with the card's location", () => {
    render(<SeminarCard seminar={SEM_NEXT} variant="banner" registerHref="/seminars#register" location="home_banner" />);
    fireEvent.click(screen.getByRole("link", {name: "Register free"}));
    expect(track).toHaveBeenCalledWith({event: "seminar_register_click", seminar_id: "SEM-NEXT", location: "home_banner"});
  });

  it("labels a seminar starting within 7 days as this week's", () => {
    render(
      <SeminarCard
        seminar={SEM_NEXT}
        variant="banner"
        registerHref="/seminars#register"
        location="home_banner"
        now={new Date("2026-10-16T12:00:00+01:00")}
      />
    );
    expect(screen.getByText("This week's free seminar")).toBeInTheDocument();
  });

  it("shows the online format instead of a venue", () => {
    const online = getSeminars().find((s) => s.id === "SEM-LATER")!;
    render(<SeminarCard seminar={online} variant="banner" registerHref="/seminars#register" location="home_banner" />);
    expect(screen.getByText("Online (YouTube Live)")).toBeInTheDocument();
  });

  it("list variant renders topic and meta in a compact row", () => {
    render(<SeminarCard seminar={SEM_NEXT} variant="list" registerHref="/seminars#register" location="upcoming_list" />);
    expect(screen.getByText("Fixture — Energy Through the Week")).toBeInTheDocument();
    expect(screen.getByText(/Fixture Hall, Surulere/)).toBeInTheDocument();
  });
});

describe("next seminar selection", () => {
  it("skips a seminar once it has started", () => {
    const during = new Date("2026-10-17T16:30:00+01:00");
    expect(getNextSeminar(during)?.id).toBe("SEM-LATER");
  });
});

describe("NextSeminarBanner", () => {
  it("shows the coming-soon state with Luma and WhatsApp actions when no seminar is upcoming", () => {
    render(<NextSeminarBanner buildNow={new Date("2030-01-01T00:00:00+01:00")} />);
    expect(screen.getByText("New seminar dates are coming soon")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Get notified of every seminar"})).toHaveAttribute("href", siteConfig.luma.calendarUrl);
    expect(screen.getByRole("link", {name: "Ask us on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});

describe("StoryCard", () => {
  it("renders quote, name and area with a photo when consented", () => {
    const story = getStories().find((s) => s.id === "FX-S1")!;
    render(<StoryCard story={story} />);
    expect(screen.getByText("Adaeze O.")).toBeInTheDocument();
    expect(screen.getByText("Surulere")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.queryByRole("link", {name: "Watch"})).not.toBeInTheDocument();
  });

  it("falls back to initials and links video stories", () => {
    const story = getStories().find((s) => s.id === "FX-S2")!;
    render(<StoryCard story={story} />);
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Watch"})).toHaveAttribute("href", "/stories#fx-s2");
  });
});

describe("ArticleCard", () => {
  it("renders topic label, title, description and reading time", () => {
    const article = getArticles()[0];
    render(<ArticleCard article={article} />);
    expect(screen.getByText("Digestion")).toBeInTheDocument();
    expect(screen.getByText(/4 min read/)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/learn/${article.slug}`);
  });

  it("compact density renders without the description", () => {
    const article = getArticles()[0];
    render(<ArticleCard article={article} density="compact" />);
    expect(screen.queryByText(article.description)).not.toBeInTheDocument();
  });

  it("shows the video badge for articles containing a video block", () => {
    const videoArticle = getArticles().find((a) => a.body.some((b) => b.type === "video"))!;
    render(<ArticleCard article={videoArticle} />);
    expect(screen.getByLabelText("Has video")).toBeInTheDocument();
  });
});

describe("section empty states", () => {
  it("hides stories and wellness hub when no content is published", () => {
    expect(render(<StoriesPreview stories={[]} />).container.firstChild).toBeNull();
    expect(render(<WellnessHubPreview articles={[]} />).container.firstChild).toBeNull();
  });
});

describe("FeaturedProducts", () => {
  it("marks cards 5+ for hiding on mobile and links chips to categories", () => {
    const products = getFeaturedProducts(8);
    const {container} = render(
      <ToastProvider>
        <FeaturedProducts products={products} />
      </ToastProvider>
    );
    const items = container.querySelectorAll("ul li");
    expect(items.length).toBe(products.length);
    if (products.length > 4) {
      expect(items[4].className).toContain("max-md:hidden");
    }
    expect(screen.getAllByRole("link", {name: "View all products"})[0]).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", {name: "All"})).toHaveAttribute("href", "/shop");
    for (const link of screen.getAllByRole("link")) {
      if (link.textContent && link.getAttribute("href")?.startsWith("/shop/")) {
        expect(link.getAttribute("href")).toMatch(/^\/shop\/[a-z-]+$/);
      }
    }
  });

  it("tracks view_item_list once when the grid intersects", () => {
    class FiringIO {
      constructor(cb: IntersectionObserverCallback) {
        cb([{isIntersecting: true} as IntersectionObserverEntry], this as never);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    const Original = IntersectionObserver;
    IntersectionObserver = FiringIO as never;
    try {
      const products = getFeaturedProducts(4);
      render(
        <ToastProvider>
          <FeaturedProducts products={products} />
        </ToastProvider>
      );
      expect(track).toHaveBeenCalledWith({event: "view_item_list", item_list_id: "home_featured", items: products.map((p) => p.id)});
    } finally {
      IntersectionObserver = Original;
    }
  });
});

describe("HomeView", () => {
  const renderHome = () =>
    render(
      <ToastProvider>
        <HomeView />
      </ToastProvider>
    );

  it("renders every section in order with fixture data", () => {
    const {container} = renderHome();
    const text = container.textContent ?? "";
    for (const fragment of SECTION_FRAGMENTS) {
      expect(text).toContain(fragment);
    }
    const order = [
      "Genuine KEDI products",
      "More than a stockist",
      "Featured products",
      "Energy Through the Week",
      "What our customers say",
      "Learn something useful",
    ];
    const positions = order.map((f) => text.indexOf(f));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(positions.every((p) => p >= 0)).toBe(true);
  });

  it("links the hero shop button and seminar register to the right paths", () => {
    renderHome();
    expect(screen.getByRole("link", {name: "Shop products"})).toHaveAttribute("href", "/shop");
    for (const link of screen.getAllByRole("link", {name: /free seminar/})) {
      expect(link).toHaveAttribute("href", "/seminars#register");
    }
  });

  it("renders the reply-time line from catalog opening hours", () => {
    renderHome();
    expect(screen.getByText(/We usually reply within 1 hour, Mon–Sat/)).toBeInTheDocument();
  });

  it("tracks the final CTA WhatsApp click with its location", () => {
    renderHome();
    fireEvent.click(screen.getByRole("link", {name: "Chat with us on WhatsApp"}));
    expect(track).toHaveBeenCalledWith({event: "whatsapp_chat_click", location: "final_cta"});
  });
});

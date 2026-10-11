import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {catalog} from "@/lib/catalog/data";
import {CategoryHeader} from "@/features/shop/components/category-header";
import {CategoryFilter} from "@/features/shop/components/category-filter";
import {EmptyState} from "@/features/shop/components/empty-state";
import {ShopHelpCta} from "@/features/shop/components/help-cta";
import {ShopHeader} from "@/features/shop/components/shop-header";

const gtag = () => window.gtag as ReturnType<typeof vi.fn>;
const digestion = catalog.categories.find((c) => c.slug === "digestion")!;

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
});

describe("ShopHeader", () => {
  it("single h1, three steps in order, delivery link", () => {
    render(<ShopHeader />);
    expect(screen.getAllByRole("heading", {level: 1})).toHaveLength(1);
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("Genuine KEDI products");
    const steps = screen.getAllByRole("listitem");
    expect(steps.map((s) => s.textContent)).toEqual([
      "1Add products to your cart",
      "2Send your order on WhatsApp",
      "3Pay to our business account and we deliver",
    ]);
    expect(screen.getByRole("link", {name: "Delivery areas and fees"})).toHaveAttribute("href", "/delivery-and-returns");
  });

  it("intro={false} renders the strip without the h1", () => {
    render(<ShopHeader intro={false} />);
    expect(screen.queryByRole("heading", {level: 1})).not.toBeInTheDocument();
    expect(screen.getByText("Add products to your cart")).toBeInTheDocument();
  });
});

describe("CategoryFilter", () => {
  const counts = new Map(catalog.categories.map((c) => [c.slug, catalog.products.filter((p) => p.categorySlug === c.slug).length]));

  it("links to /shop plus every active category with counts; active marked", () => {
    render(<CategoryFilter categories={catalog.categories} counts={counts} total={9} activeSlug="digestion" search={{}} />);
    expect(screen.getByRole("link", {name: /All products \(9\)/})).toHaveAttribute("href", "/shop");
    for (const c of catalog.categories) {
      const count = counts.get(c.slug)!;
      expect(
        screen.getByRole("link", {name: new RegExp(`${c.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\(${count}\\)`)})
      ).toHaveAttribute("href", `/shop/${c.slug}`);
    }
    expect(screen.getByRole("link", {name: /Fixture Digestion \(2\)/})).toHaveAttribute("aria-current", "page");
  });

  it("preserves q and sort in hrefs and tracks filter_category", async () => {
    const user = userEvent.setup();
    render(
      <CategoryFilter categories={catalog.categories} counts={counts} total={9} activeSlug={null} search={{q: "tea", sort: "price-asc"}} />
    );
    expect(screen.getByRole("link", {name: /All products/})).toHaveAttribute("href", "/shop?q=tea&sort=price-asc");
    await user.click(screen.getByRole("link", {name: /Fixture Energy & Vitality/}));
    expect(gtag()).toHaveBeenCalledWith("event", "filter_category", expect.objectContaining({category: "energy"}));
  });
});

describe("EmptyState", () => {
  it("no-results: exact copy, clear action, WhatsApp href carries the term", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<EmptyState kind="no-results" term="ginseng drink" onClear={onClear} />);
    expect(screen.getByRole("heading", {name: 'No products match "ginseng drink"'})).toBeInTheDocument();
    const wa = screen.getByRole("link", {name: "Ask us on WhatsApp"});
    expect(decodeURIComponent(wa.getAttribute("href")!).replace(/\+/g, " ")).toContain('"ginseng drink"');
    await user.click(screen.getByRole("button", {name: "Clear search"}));
    expect(onClear).toHaveBeenCalled();
    await user.click(wa);
    expect(gtag()).toHaveBeenCalledWith(
      "event",
      "whatsapp_chat_click",
      expect.objectContaining({location: "shop_no_results", context: "ginseng drink"})
    );
  });

  it("empty-category: exact copy and both actions", () => {
    render(<EmptyState kind="empty-category" category="Immunity" />);
    expect(screen.getByRole("heading", {name: "Nothing in Immunity right now"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "See all products"})).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", {name: "Ask on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});

describe("CategoryHeader", () => {
  it("h1 is the category name with breadcrumbs, description and count", () => {
    render(<CategoryHeader category={digestion} count={2} />);
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("Fixture Digestion");
    const crumbs = screen.getByRole("navigation", {name: "Breadcrumb"});
    expect(crumbs).toHaveTextContent("Home");
    expect(crumbs).toHaveTextContent("Shop");
    expect(screen.getByText(digestion.description)).toBeInTheDocument();
    expect(screen.getByText("2 products")).toBeInTheDocument();
  });
});

describe("ShopHelpCta", () => {
  it("renders the exact title and both actions", async () => {
    const user = userEvent.setup();
    render(<ShopHelpCta />);
    expect(screen.getByRole("heading", {name: "Not sure which to choose?"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "See seminar dates"})).toHaveAttribute("href", "/seminars");
    await user.click(screen.getByRole("link", {name: "Ask on WhatsApp"}));
    expect(gtag()).toHaveBeenCalledWith("event", "whatsapp_chat_click", expect.objectContaining({location: "shop_help"}));
  });
});

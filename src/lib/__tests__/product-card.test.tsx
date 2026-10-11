import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ToastProvider} from "@/components/ui/toast";
import {ProductCard} from "@/components/marketing/product-card";
import {ProductGrid} from "@/features/shop/components/product-grid";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {catalog} from "@/lib/catalog/data";
import type {Product} from "@/lib/catalog/types";

const product = (id: string): Product => catalog.products.find((p) => p.id === id)!;
const priced = product("KD-F001");
const askPrice = product("KD-F002");
const oos = product("KD-F005");
const gtag = () => window.gtag as ReturnType<typeof vi.fn>;

const renderCard = (p: Product, props = {}) =>
  render(
    <ToastProvider>
      <ProductCard product={p} {...props} />
    </ToastProvider>
  );

// vitest.setup stubs IntersectionObserver with a no-op — replace it with one
// that reports intersecting so ProductGrid's "visible → track" path runs.
class FiringIntersectionObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {
    this.cb([{isIntersecting: true} as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
  IntersectionObserver = FiringIntersectionObserver as unknown as typeof IntersectionObserver;
});

describe("ProductCard", () => {
  it("renders name, benefit, pack size/duration, price and product link", () => {
    renderCard(priced);
    expect(screen.getByRole("link", {name: priced.name})).toHaveAttribute("href", `/products/${priced.slug}`);
    expect(screen.getByText(priced.shortBenefit)).toBeInTheDocument();
    expect(screen.getByText("₦18,500")).toBeInTheDocument();
    expect(screen.getByText(/30 teabags/)).toHaveTextContent("30 teabags · Lasts about 30 days");
    expect(screen.getByText("Fixture Digestion")).toBeInTheDocument(); // category eyebrow
  });

  it("shows Out of stock badge and Ask-on-WhatsApp instead of an add button", () => {
    renderCard(oos);
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Ask on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(screen.queryByRole("button", {name: /add/i})).not.toBeInTheDocument();
  });

  it("renders Ask for price for null-priced products", () => {
    renderCard(askPrice);
    expect(screen.getByText("Ask for price")).toBeInTheDocument();
  });

  it("does not navigate when Add to cart is clicked", async () => {
    const user = userEvent.setup();
    renderCard(priced);
    await user.click(screen.getByRole("button", {name: /add to cart/i}));
    expect(window.location.pathname).toBe("/");
    expect(await screen.findByRole("button", {name: "Add another"}, {timeout: 2500})).toBeInTheDocument();
  });
});

describe("ProductGrid", () => {
  it("renders a list with every product and tracks view_item_list once per result set", () => {
    const items = [priced, askPrice, oos];
    const {rerender} = render(
      <ToastProvider>
        <ProductGrid items={items} listId="shop" />
      </ToastProvider>
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(gtag()).toHaveBeenCalledWith(
      "event",
      "view_item_list",
      expect.objectContaining({item_list_id: "shop", items: ["KD-F001", "KD-F002", "KD-F005"]})
    );
    // Same result set re-rendered → no duplicate event.
    gtag().mockClear();
    rerender(
      <ToastProvider>
        <ProductGrid items={items} listId="shop" />
      </ToastProvider>
    );
    expect(gtag()).not.toHaveBeenCalledWith("event", "view_item_list", expect.anything());
  });

  it("tracks select_item when a card link is tapped", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ProductGrid items={[priced]} listId="shop:digestion" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("link", {name: priced.name}));
    expect(gtag()).toHaveBeenCalledWith(
      "event",
      "select_item",
      expect.objectContaining({item_list_id: "shop:digestion", item_id: "KD-F001"})
    );
  });
});

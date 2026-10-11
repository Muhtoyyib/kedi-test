import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {act, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, notFound, Outlet, RouterProvider} from "@tanstack/react-router";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {getCategory} from "@/lib/catalog/categories";
import {catalog} from "@/lib/catalog/data";
import {ToastProvider} from "@/components/ui/toast";
import {ShopView} from "@/features/shop/view";
import {validateShopSearch} from "@/features/shop/use-shop-query";

// Minimal route tree mirroring shop.index + shop.$category (same
// validateSearch and loader semantics as the real routes).
const rootRoute = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  ),
  notFoundComponent: () => <p>Page not found</p>,
});
const shopIndex = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  validateSearch: validateShopSearch,
  component: () => <ShopView category={null} />,
});
const shopCategory = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop/$category",
  validateSearch: validateShopSearch,
  loader: ({params}) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return {category};
  },
  component: function CategoryPage() {
    const {category} = shopCategory.useLoaderData();
    return <ShopView category={category} />;
  },
});
const routeTree = rootRoute.addChildren([shopIndex, shopCategory]);

function renderShop(path: string) {
  const router = createRouter({routeTree, history: createMemoryHistory({initialEntries: [path]})});
  const utils = render(<RouterProvider router={router} />);
  return {router, ...utils};
}

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
});

describe("/shop page", () => {
  it("renders every fixture product with header, filter chips and help CTA", async () => {
    renderShop("/shop");
    expect(await screen.findByRole("heading", {level: 1, name: "Genuine KEDI products"})).toBeInTheDocument();
    for (const p of catalog.products) {
      expect(screen.getByRole("link", {name: p.name})).toHaveAttribute("href", `/products/${p.slug}`);
    }
    expect(screen.getByRole("navigation", {name: "Product categories"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Not sure which to choose?"})).toBeInTheDocument();
  });

  it("/shop/{slug} lists only that category's products", async () => {
    renderShop("/shop/energy");
    expect(await screen.findByRole("heading", {level: 1, name: "Fixture Energy & Vitality"})).toBeInTheDocument();
    const energy = catalog.products.filter((p) => p.categorySlug === "energy");
    const others = catalog.products.filter((p) => p.categorySlug !== "energy");
    for (const p of energy) expect(screen.getByRole("link", {name: p.name})).toBeInTheDocument();
    for (const p of others) expect(screen.queryByRole("link", {name: p.name})).not.toBeInTheDocument();
  });

  it("unknown category renders the not-found page", async () => {
    renderShop("/shop/not-a-category");
    expect(await screen.findByText("Page not found")).toBeInTheDocument();
  });

  it("typing filters the grid after the URL debounce and announces the count", async () => {
    vi.useFakeTimers({shouldAdvanceTime: true});
    try {
      const {router} = renderShop("/shop");
      await screen.findByRole("heading", {level: 1, name: "Genuine KEDI products"});
      const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime});
      await user.type(screen.getByLabelText("Search products"), "teabags");
      act(() => vi.advanceTimersByTime(400)); // 300ms URL debounce
      expect(router.state.location.search).toMatchObject({q: "teabags"});
      expect(await screen.findByText(/Showing 1 of 9 products/)).toBeInTheDocument();
      expect(screen.queryByRole("link", {name: catalog.products[3].name})).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("a q= link restores the filtered listing; a dead-end offers WhatsApp", async () => {
    renderShop("/shop?q=ginseng%20drink");
    // Pre-hydration the static listing shows everything; after hydration the
    // filter applies — findBy* waits for that pass.
    expect(await screen.findByRole("heading", {name: 'No products match "ginseng drink"'})).toBeInTheDocument();
    const wa = screen.getByRole("link", {name: "Ask us on WhatsApp"});
    expect(decodeURIComponent(wa.getAttribute("href")!).replace(/\+/g, " ")).toContain('"ginseng drink"');
  });

  it("sort=price-asc orders the grid by price with ask-price last", async () => {
    renderShop("/shop?sort=price-asc");
    await screen.findByRole("heading", {level: 1});
    const links = screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/products/"));
    const priced = catalog.products.filter((p) => p.priceNgn !== null).sort((a, b) => a.priceNgn! - b.priceNgn!);
    expect(links[0]).toHaveAttribute("href", `/products/${priced[0].slug}`);
  });
});

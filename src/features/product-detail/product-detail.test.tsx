import {describe, expect, it, vi} from "vite-plus/test";
import {fireEvent, render, screen} from "@testing-library/react";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, notFound, Outlet, RouterProvider} from "@tanstack/react-router";
import {ToastProvider} from "@/components/ui/toast";
import {AboutProduct} from "./components/about-product";
import {ImageGallery} from "./components/image-gallery";
import {StickyBuyBar} from "./components/sticky-buy-bar";
import {HowToUse} from "./components/how-to-use";
import {ProductFacts} from "./components/product-facts";
import {ProductFaqs} from "./components/product-faqs";
import {PurchasePanel} from "./components/purchase-panel";
import {RelatedProducts} from "./components/related-products";
import {getFaqs} from "@/lib/content/faq";
import {ProductDetailView} from "./view";

vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));
import {track} from "@/lib/analytics/track";

vi.mock("@/lib/catalog/products", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/catalog/products")>();
  return {...actual, getRelatedProducts: vi.fn(actual.getRelatedProducts)};
});
import {getProduct, getRelatedProducts} from "@/lib/catalog/products";

const tea = getProduct("fixture-digestive-tea")!;
const askPrice = getProduct("fixture-colon-cleanser")!;
const outOfStock = getProduct("fixture-heart-support")!;
const noNafdac = getProduct("fixture-vitality-tonic")!;

const renderWithToast = (ui: React.ReactElement) => render(<ToastProvider>{ui}</ToastProvider>);

describe("PurchasePanel", () => {
  it("shows name, benefit, pack, duration, price and stock", () => {
    renderWithToast(<PurchasePanel product={tea} />);
    expect(screen.getByRole("heading", {name: tea.name})).toBeInTheDocument();
    expect(screen.getByText(tea.shortBenefit)).toBeInTheDocument();
    expect(screen.getByText(/30 teabags · Lasts about 30 days/)).toBeInTheDocument();
    expect(screen.getByText("₦18,500")).toBeInTheDocument();
    expect(screen.getByText("In stock")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Ask about this product on WhatsApp"})).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me")
    );
    for (const line of ["Genuine KEDI product", "fee confirmed on WhatsApp", "check in after delivery"]) {
      expect(screen.getByText(new RegExp(line))).toBeInTheDocument();
    }
  });

  it("tracks the WhatsApp ask with the product context", () => {
    renderWithToast(<PurchasePanel product={tea} />);
    fireEvent.click(screen.getByRole("link", {name: "Ask about this product on WhatsApp"}));
    expect(track).toHaveBeenCalledWith({event: "whatsapp_chat_click", location: "pdp_ask", context: "KD-F001"});
  });

  it("hides add to cart and switches the ask label when out of stock", () => {
    renderWithToast(<PurchasePanel product={outOfStock} />);
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    expect(screen.queryByRole("button", {name: /Add to cart/})).not.toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Ask when it's back in stock"})).toBeInTheDocument();
  });

  it("shows the price-confirmation helper for ask-price products", () => {
    renderWithToast(<PurchasePanel product={askPrice} />);
    expect(screen.getByText("Ask for price")).toBeInTheDocument();
    expect(screen.getByText("We'll confirm the price on WhatsApp")).toBeInTheDocument();
  });
});

describe("ImageGallery", () => {
  it("swaps the main image when a thumbnail is clicked and labels the dots", () => {
    render(<ImageGallery product={tea} />);
    // mobile dots + desktop thumbnails share the same accessible label
    const controls = screen.getAllByRole("button", {name: /Show image \d of 3/});
    expect(controls).toHaveLength(6);
    // before the click only the mobile strip's own button carries this label
    expect(screen.getAllByRole("button", {name: "Zoom Fixture Digestive Tea — image 2"})).toHaveLength(1);
    fireEvent.click(controls[controls.length - 2]); // desktop thumb for image 2
    // now the desktop main image also carries it
    expect(screen.getAllByRole("button", {name: "Zoom Fixture Digestive Tea — image 2"})).toHaveLength(2);
  });

  it("hides dots and thumbnails for a single photo and loads the first eagerly", () => {
    render(<ImageGallery product={noNafdac} />);
    expect(screen.queryByRole("button", {name: /Show image \d of \d/})).not.toBeInTheDocument();
    for (const img of screen.getAllByRole("img")) expect(img).toHaveAttribute("loading", "eager");
  });

  it("opens and closes the full-screen viewer", async () => {
    render(<ImageGallery product={tea} />);
    fireEvent.click(screen.getAllByRole("button", {name: /Zoom/})[0]);
    expect(await screen.findByRole("dialog", {name: "Product photo viewer"})).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Close"}));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("AboutProduct", () => {
  it("renders description paragraphs verbatim and ingredients in order", () => {
    render(<AboutProduct product={tea} />);
    for (const p of tea.description) expect(screen.getByText(p)).toBeInTheDocument();
    const items = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(items).toEqual(tea.ingredients);
  });

  it("shows a Read more toggle for long descriptions on mobile", () => {
    const longDesc = {...tea, description: [...tea.description, "para three", "para four", "para five"]};
    render(<AboutProduct product={longDesc} />);
    const toggle = screen.getByRole("button", {name: "Read more"});
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", {name: "Read less"})).toBeInTheDocument();
    // full text still in the DOM (crawlable / no-JS)
    expect(document.body.textContent).toContain("para five");
  });

  it("omits the ingredients heading when the Sheet field is empty", () => {
    render(<AboutProduct product={{...tea, ingredients: []}} />);
    expect(screen.queryByText("Key ingredients")).not.toBeInTheDocument();
  });
});

describe("HowToUse", () => {
  it("lists usage lines verbatim in order with the safety note", () => {
    render(<HowToUse product={tea} />);
    for (const step of tea.howToUse) expect(screen.getByText(step)).toBeInTheDocument();
    expect(screen.getByText(/Always follow the instructions on the pack/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Learn more at our free seminar"})).toHaveAttribute("href", "/seminars");
  });
});

describe("ProductFacts", () => {
  it("lists NAFDAC, pack, duration, category and copyable code", () => {
    renderWithToast(<ProductFacts product={tea} />);
    expect(screen.getByText("F1-0001")).toBeInTheDocument();
    expect(screen.getByText(/NAFDAC website/)).toBeInTheDocument();
    expect(screen.getByText("KD-F001")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Fixture Digestion"})).toHaveAttribute("href", "/shop/digestion");
  });

  it("omits the NAFDAC row and note when no number is provided", () => {
    renderWithToast(<ProductFacts product={noNafdac} />);
    expect(screen.queryByText(/NAFDAC/)).not.toBeInTheDocument();
    expect(screen.getByText("KD-F006")).toBeInTheDocument();
  });
});

describe("ProductFaqs", () => {
  it("puts the product's own questions before the ordering ones", () => {
    render(<ProductFaqs product={tea} />);
    const headings = screen.getAllByRole("heading", {level: 2});
    expect(headings[0].textContent).toBe(`Questions about ${tea.name}`);
    const text = document.body.textContent ?? "";
    expect(text.indexOf(tea.faqs[0].question)).toBeLessThan(text.indexOf("How do I order?"));
    expect(screen.getByRole("link", {name: "Ask on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});

describe("ProductFaqs empty case", () => {
  it("renders only the general ordering questions when the product has none", () => {
    render(<ProductFaqs product={askPrice} />);
    expect(screen.queryByText(tea.faqs[0].question)).not.toBeInTheDocument();
    for (const id of ["how-to-order", "how-to-pay", "delivery-areas"]) {
      const q = getFaqs().find((f) => f.id === id)?.question;
      expect(q).toBeDefined();
      expect(screen.getByText(q!)).toBeInTheDocument();
    }
  });
});

describe("RelatedProducts empty case", () => {
  it("hides the section when no other products exist", () => {
    vi.mocked(getRelatedProducts).mockReturnValueOnce([]);
    expect(render(<RelatedProducts product={tea} />).container.firstChild).toBeNull();
  });
});

describe("StickyBuyBar", () => {
  it("renders hidden and inert before the anchor scrolls out", () => {
    renderWithToast(<StickyBuyBar product={tea} />);
    const bar = document.querySelector("[aria-hidden='true']");
    expect(bar).not.toBeNull();
    expect(bar).toHaveAttribute("inert");
  });

  it("shows the out-of-stock variant", () => {
    const {container} = renderWithToast(<StickyBuyBar product={outOfStock} />);
    // the bar is inert until the anchor scrolls out, so query the DOM directly
    const ask = container.querySelector('a[href*="wa.me"]');
    expect(ask).not.toBeNull();
    expect(ask?.textContent).toContain("Ask when back in stock");
    expect(container.querySelector('a[aria-label*="Ask about"]')).toBeNull();
  });
});

describe("ProductDetailView", () => {
  it("renders all sections in order for an in-stock product", () => {
    renderWithToast(<ProductDetailView product={tea} />);
    const text = document.body.textContent ?? "";
    const order = [
      "Home",
      tea.name,
      "About this product",
      "speak to a doctor first",
      "Product facts",
      `Questions about ${tea.name}`,
      "You may also like",
      "food supplements",
    ];
    const positions = order.map((f) => text.indexOf(f));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    // breadcrumb trail + mobile back link both reach the category
    for (const link of screen.getAllByRole("link", {name: /Fixture Digestion/})) {
      expect(link).toHaveAttribute("href", "/shop/digestion");
    }
    expect(screen.getByRole("link", {name: "Read our full health disclaimer"})).toHaveAttribute("href", "/health-disclaimer");
  });

  it("never renders the current product in the related list", () => {
    renderWithToast(<ProductDetailView product={tea} />);
    const related = screen.getByRole("heading", {name: "You may also like"}).nextElementSibling!;
    expect(related.textContent).not.toContain(tea.name);
  });
});

// Mini router mirroring the real route's loader/notFound semantics.
const rootRoute = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  ),
  notFoundComponent: () => <p>Page not found</p>,
});
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$slug",
  loader: ({params}) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return {product};
  },
  component: function PdpPage() {
    const {product} = productRoute.useLoaderData();
    return <ProductDetailView product={product} />;
  },
});
const routeTree = rootRoute.addChildren([productRoute]);

describe("/products/$slug route", () => {
  it("shows the not-found page for an unknown slug", async () => {
    const router = createRouter({routeTree, history: createMemoryHistory({initialEntries: ["/products/no-such-product"]})});
    render(<RouterProvider router={router} />);
    expect(await screen.findByText("Page not found")).toBeInTheDocument();
  });
});

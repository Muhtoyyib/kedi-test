import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {act, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ToastProvider} from "@/components/ui/toast";
import {AddToCartButton} from "@/features/cart/add-to-cart-button";
import {CartDrawer} from "@/features/cart/cart-drawer";
import {QuantityStepper} from "@/features/cart/quantity-stepper";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {cartDrawer} from "@/lib/cart/drawer-state";
import {dispatch} from "@/lib/cart/store";
import {catalog} from "@/lib/catalog/data";
import type {Product} from "@/lib/catalog/types";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {outOfStockMessage} from "@/lib/whatsapp/messages";

// 21 known products so the 20-line cart limit is reachable (the fixture has 9).
vi.mock("@/lib/catalog/data", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/catalog/data")>();
  const extras = Array.from({length: 12}, (_, i) => ({...real.catalog.products[0], id: `KD-X${i}`}));
  return {...real, catalog: {...real.catalog, products: [...real.catalog.products, ...extras]}};
});

const product = (id: string): Product => catalog.products.find((p) => p.id === id)!;
const priced = product("KD-F001");
const askPrice = product("KD-F002");
const oos = product("KD-F005");
const gtag = () => window.gtag as ReturnType<typeof vi.fn>;

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
});

describe("QuantityStepper", () => {
  it("clamps at 1 and 20 with labelled buttons and a live output", async () => {
    const user = userEvent.setup();
    let qty = 1;
    const {rerender} = render(<QuantityStepper qty={qty} onChange={(n) => (qty = n)} />);
    expect(screen.getByRole("button", {name: "Decrease quantity"})).toBeDisabled();
    await user.click(screen.getByRole("button", {name: "Increase quantity"}));
    rerender(<QuantityStepper qty={20} onChange={() => {}} />);
    expect(screen.getByRole("button", {name: "Increase quantity"})).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("20");
  });
});

describe("AddToCartButton", () => {
  it("card: adds 1, shows 'Added ✓' and a toast with a View cart action", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddToCartButton product={priced} variant="card" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", {name: /Add to cart/}));
    expect(screen.getByRole("button", {name: /Added ✓/})).toBeInTheDocument();
    expect(await screen.findByText(`Added to cart · ${priced.name}`)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "View cart"})).toBeInTheDocument();
    expect(gtag()).toHaveBeenCalledWith(
      "event",
      "add_to_cart",
      expect.objectContaining({item_id: "KD-F001", quantity: 1, location: "card"})
    );
  });

  it("sticky: 'Add another' plus 'In your cart' after the first add", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddToCartButton product={priced} variant="sticky" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", {name: "Add to cart"}));
    expect(await screen.findByRole("button", {name: /Add another/}, {timeout: 2500})).toBeInTheDocument();
    expect(screen.getByText("In your cart: 1")).toBeInTheDocument();
  });

  it("pdp: adds the quantity chosen on the stepper", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddToCartButton product={priced} variant="pdp" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", {name: "Increase quantity"}));
    await user.click(screen.getByRole("button", {name: "Increase quantity"}));
    await user.click(screen.getByRole("button", {name: "Add to cart"}));
    expect(JSON.parse(window.localStorage.getItem("cart:v1")!).lines).toEqual([{productId: "KD-F001", qty: 3}]);
  });

  it("ask-price products stay addable with a confirm note", () => {
    render(
      <ToastProvider>
        <AddToCartButton product={askPrice} variant="card" />
      </ToastProvider>
    );
    expect(screen.getByRole("button", {name: /Add to order/})).toBeInTheDocument();
    expect(screen.getByText("We'll confirm the price on WhatsApp")).toBeInTheDocument();
  });

  it("out-of-stock shows an 'Ask on WhatsApp' link and tracks the click", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <AddToCartButton product={oos} variant="card" />
      </ToastProvider>
    );
    expect(screen.queryByRole("button", {name: /Add to cart/})).not.toBeInTheDocument();
    const link = screen.getByRole("link", {name: "Ask on WhatsApp"});
    expect(link).toHaveAttribute("href", buildWhatsAppLink(outOfStockMessage(oos)));
    await user.click(link);
    expect(gtag()).toHaveBeenCalledWith("event", "whatsapp_chat_click", expect.objectContaining({location: "out_of_stock"}));
  });

  it("refuses a 21st product with the cart-full message", async () => {
    const user = userEvent.setup();
    for (const p of catalog.products.filter((p) => p.id !== "KD-F001").slice(0, 20)) dispatch({type: "add", productId: p.id});
    render(
      <ToastProvider>
        <AddToCartButton product={priced} variant="card" />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", {name: /Add to cart/}));
    expect(await screen.findByText("Your cart is full. Send this order first, or message us for large orders.")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem("cart:v1")!).lines).toHaveLength(20);
  });
});

describe("CartDrawer", () => {
  it("empty state offers shop and WhatsApp actions", () => {
    render(<CartDrawer open />);
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Shop products"})).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", {name: "Ask on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("lists lines, shows the summary and safety note, and tracks view_cart", () => {
    act(() => {
      dispatch({type: "add", productId: "KD-F001", qty: 2});
      dispatch({type: "add", productId: "KD-F002"});
    });
    render(<CartDrawer open />);
    expect(screen.getByText("Your order (3 items)")).toBeInTheDocument();
    expect(screen.getByText("Fixture Digestive Tea")).toBeInTheDocument();
    expect(screen.getAllByText("₦37,000").length).toBeGreaterThanOrEqual(3); // line total, subtotal, sticky bar
    expect(screen.getByText("+ items to confirm")).toBeInTheDocument();
    expect(screen.getByText("Confirmed on WhatsApp")).toBeInTheDocument();
    expect(screen.getByText(/We only send payment details/)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Close cart"})).toBeInTheDocument();
    expect(gtag()).toHaveBeenCalledWith("event", "view_cart", expect.objectContaining({item_count: 3, value: 37000}));
  });

  it("warns about removed products and empties in place when the last line is removed", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "cart:v1",
      JSON.stringify({
        version: 1,
        lines: [
          {productId: "GONE", qty: 1},
          {productId: "KD-F001", qty: 1},
        ],
      })
    );
    render(<CartDrawer open />);
    expect(screen.getByText("1 item is no longer available and was removed.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", {name: `Remove ${priced.name}`}));
    expect(await screen.findByText("Your cart is empty")).toBeInTheDocument();
  });

  it("edits quantities with the compact stepper", async () => {
    const user = userEvent.setup();
    act(() => dispatch({type: "add", productId: "KD-F001"}));
    render(<CartDrawer open />);
    await user.click(screen.getByRole("button", {name: "Increase quantity"}));
    expect(screen.getAllByText("₦37,000").length).toBeGreaterThanOrEqual(3);
  });
});

describe("cart drawer state", () => {
  it("opens and closes via the shared store", async () => {
    cartDrawer.open();
    expect(cartDrawer.getSnapshot()).toBe(true);
    expect(cartDrawer.getEverOpened()).toBe(true);
    cartDrawer.close();
    expect(cartDrawer.getSnapshot()).toBe(false);
  });

  it("lazy-mounts the drawer for ?cart=open", async () => {
    const {CartDrawerMount} = await import("@/features/cart/cart-drawer-mount");
    window.history.replaceState(null, "", "/?cart=open");
    render(<CartDrawerMount />);
    expect(await screen.findByText("Your cart is empty")).toBeInTheDocument();
    window.history.replaceState(null, "", "/");
    cartDrawer.close();
  });
});

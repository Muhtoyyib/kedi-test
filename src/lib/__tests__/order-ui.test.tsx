import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {act, render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {OrderDetailsForm} from "@/features/cart/order-details-form";
import {SendOrderButton} from "@/features/cart/send-order-button";
import {useOrderDetails} from "@/features/cart/use-order-details";
import {ReturnBanner} from "@/features/cart/return-banner";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {cartDrawer} from "@/lib/cart/drawer-state";
import {dispatch} from "@/lib/cart/store";
import {clearPending, savePending} from "@/lib/order/pending";
import {REFERRAL_KEY} from "@/lib/referral";

function Harness() {
  const state = useOrderDetails();
  return (
    <>
      <OrderDetailsForm state={state} checkout={{itemCount: 2, value: 37000}} />
      <SendOrderButton state={state} />
    </>
  );
}

const seedCart = () => dispatch({type: "add", productId: "KD-F001", qty: 2});
const openSpy = () => vi.spyOn(window, "open").mockImplementation(() => null);

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.localStorage.clear();
  window.sessionStorage.clear();
  clearPending();
  cartDrawer.close();
});

describe("OrderDetailsForm", () => {
  it("validates on blur with the field copy and tracks begin_checkout once", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const name = screen.getByLabelText(/Full name/);
    await user.click(name);
    await user.tab();
    expect(await screen.findByText("Enter your name so we know who's ordering")).toBeInTheDocument();
    await user.click(screen.getByLabelText(/WhatsApp number/));
    expect(window.gtag).toHaveBeenCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", "begin_checkout", {item_count: 2, value: 37000});
  });

  it("reveals 'Your area' only when Other is chosen", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    expect(screen.queryByLabelText(/^Your area/)).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/Delivery area/), "__other__");
    expect(await screen.findByLabelText(/^Your area/)).toBeInTheDocument();
  });

  it("pre-fills the stored referral code with an 'Applied ✓' badge", () => {
    window.localStorage.setItem(REFERRAL_KEY, JSON.stringify({code: "AMAKA-4821", at: Date.now()}));
    render(<Harness />);
    expect(screen.getByLabelText(/Referral code/)).toHaveValue("AMAKA-4821");
    expect(screen.getByText("Applied ✓")).toBeInTheDocument();
  });

  it("remembers details but never consent, and 'Not you?' clears them", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "order-details:v1",
      JSON.stringify({name: "Ngozi Adeyemi", phone: "0803 123 4567", area: "Fixture Ikeja", areaOther: ""})
    );
    render(<Harness />);
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Ngozi Adeyemi");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    await user.click(screen.getByRole("button", {name: "Not you? Clear details"}));
    expect(screen.getByLabelText(/Full name/)).toHaveValue("");
  });

  it("hides the honeypot from assistive tech and tab order", () => {
    render(<Harness />);
    const trap = screen.getByLabelText("Company", {selector: "input"});
    expect(trap).toHaveAttribute("tabIndex", "-1");
    expect(trap).toHaveAttribute("autocomplete", "off");
    expect(trap.parentElement).toHaveAttribute("aria-hidden", "true");
  });
});

describe("SendOrderButton", () => {
  it("blocks invalid sends with a summary and focuses the first bad field", async () => {
    const user = userEvent.setup();
    const open = openSpy();
    seedCart();
    render(<Harness />);
    await user.click(screen.getByRole("button", {name: "Send order on WhatsApp"}));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please fix 3 fields to send your order");
    expect(screen.getByLabelText(/Full name/)).toHaveFocus();
    expect(open).not.toHaveBeenCalled();
  });

  it("sends exactly once on a double tap and opens WhatsApp", async () => {
    const user = userEvent.setup();
    const open = openSpy();
    seedCart();
    render(<Harness />);
    await user.type(screen.getByLabelText(/Full name/), "Ngozi Adeyemi");
    await user.type(screen.getByLabelText(/WhatsApp number/), "0803 123 4567");
    await user.selectOptions(screen.getByLabelText(/Delivery area/), "Fixture Ikeja");
    const send = screen.getByRole("button", {name: "Send order on WhatsApp"});
    await user.click(send);
    await user.click(send);
    expect(open).toHaveBeenCalledTimes(1);
    expect(decodeURIComponent(new URL(open.mock.calls[0][0] as string).searchParams.get("text")!)).toContain("Order ID: KD-");
    open.mockRestore();
  });
});

describe("ReturnBanner", () => {
  const seedPending = (overrides = {}) => {
    seedCart();
    savePending({orderId: "KD-261012-7F3K", at: Date.now(), cartHash: "KD-F001:2", message: "Hello!", ...overrides});
  };

  it("asks after returning (pageshow persisted / visible) when the cart hash matches", () => {
    seedPending();
    render(<ReturnBanner />);
    expect(screen.getByText("Did your order KD-261012-7F3K send on WhatsApp?")).toBeInTheDocument();
  });

  it("shows the banner when a pageshow persisted event lands after mount", () => {
    seedCart();
    render(<ReturnBanner />);
    expect(screen.queryByText(/send on WhatsApp\?/)).not.toBeInTheDocument();
    act(() => {
      savePending({orderId: "KD-261012-7F3K", at: Date.now(), cartHash: "KD-F001:2", message: "Hello!"});
      const event = new Event("pageshow") as PageTransitionEvent;
      Object.defineProperty(event, "persisted", {value: true});
      window.dispatchEvent(event);
    });
    expect(screen.getByText(/send on WhatsApp\?/)).toBeInTheDocument();
  });

  it("'Yes, it's sent' clears the cart and thanks the customer", async () => {
    const user = userEvent.setup();
    seedPending();
    render(<ReturnBanner />);
    await user.click(screen.getByRole("button", {name: "Yes, it's sent"}));
    expect(screen.getByRole("status")).toHaveTextContent("Thank you! We'll reply shortly");
    expect(JSON.parse(window.localStorage.getItem("cart:v1")!).lines).toEqual([]);
    expect(screen.queryByText(/send on WhatsApp\?/)).not.toBeInTheDocument();
  });

  it("'Open WhatsApp again' reopens the same message without a new beacon", async () => {
    const user = userEvent.setup();
    const open = openSpy();
    seedPending();
    render(<ReturnBanner />);
    await user.click(screen.getByRole("button", {name: "Open WhatsApp again"}));
    expect(decodeURIComponent(new URL(open.mock.calls[0][0] as string).searchParams.get("text")!)).toBe("Hello!");
    open.mockRestore();
  });

  it("hides for expired markers and after the cart changes", async () => {
    seedPending({at: Date.now() - 25 * 60 * 60 * 1000});
    const first = render(<ReturnBanner />);
    expect(screen.queryByText(/send on WhatsApp\?/)).not.toBeInTheDocument();
    first.unmount();
    clearPending();
    dispatch({type: "clear"});
    seedPending();
    render(<ReturnBanner />);
    expect(screen.getByText(/send on WhatsApp\?/)).toBeInTheDocument();
    act(() => dispatch({type: "setQty", productId: "KD-F001", qty: 5}));
    expect(screen.queryByText(/send on WhatsApp\?/)).not.toBeInTheDocument();
  });

  it("'Edit order' opens the cart drawer", async () => {
    const user = userEvent.setup();
    seedPending();
    render(<ReturnBanner />);
    await user.click(screen.getByRole("button", {name: "Edit order"}));
    expect(cartDrawer.getSnapshot()).toBe(true);
  });
});

import {describe, expect, it} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {Button} from "@/components/ui/button";
import {Price} from "@/components/ui/price";
import {Disclaimer} from "@/components/ui/disclaimer";

describe("Button", () => {
  it("renders an anchor when href is given, with rel=noopener for external links", () => {
    render(<Button href="https://example.com">Chat</Button>);
    const link = screen.getByRole("link", {name: "Chat"});
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("rel", "noopener");
  });

  it("internal links do not get rel=noopener", () => {
    render(<Button href="/shop">Shop</Button>);
    expect(screen.getByRole("link", {name: "Shop"})).not.toHaveAttribute("rel");
  });

  it("loading disables the button and sets aria-busy", () => {
    render(<Button loading>Send order</Button>);
    const button = screen.getByRole("button", {name: "Send order"});
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("the whatsapp variant renders the WhatsApp glyph", () => {
    render(<Button variant="whatsapp">Chat with us</Button>);
    expect(screen.getByRole("button", {name: "Chat with us"}).querySelector("svg")).toBeInTheDocument();
  });
});

describe("Price", () => {
  it("formats a price in naira", () => {
    render(<Price amountNgn={18500} />);
    expect(screen.getByText("₦18,500")).toBeInTheDocument();
  });

  it("renders 'Ask for price' when the price is null", () => {
    render(<Price amountNgn={null} />);
    expect(screen.getByText("Ask for price")).toBeInTheDocument();
  });
});

describe("Disclaimer", () => {
  it("renders the exact health disclaimer text", () => {
    render(<Disclaimer kind="health" />);
    expect(
      screen.getByText(
        "These products are food supplements and wellness products. They are not intended to diagnose, treat, cure or prevent any disease. Always follow the usage instructions on the pack. If you are pregnant, breastfeeding, taking medication or have a medical condition, speak to a doctor before use."
      )
    ).toBeInTheDocument();
  });

  it("renders the exact earnings disclaimer text", () => {
    render(<Disclaimer kind="earnings" />);
    expect(
      screen.getByText(
        "Becoming a distributor is a business, not a job or a guaranteed income. What you earn depends entirely on your own effort, sales and KEDI's official compensation plan. We do not promise any level of income."
      )
    ).toBeInTheDocument();
  });
});

describe("Button click", () => {
  it("still fires onClick when rendered as a link and not loading", async () => {
    const user = userEvent.setup();
    let clicked = 0;
    render(
      <Button href="/x" onClick={() => (clicked += 1)}>
        Go
      </Button>
    );
    await user.click(screen.getByRole("link", {name: "Go"}));
    expect(clicked).toBe(1);
  });
});

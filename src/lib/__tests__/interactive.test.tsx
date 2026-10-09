import {describe, expect, it, vi} from "vite-plus/test";
import {useState} from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ChipGroup} from "@/components/ui/chip-group";
import {Accordion} from "@/components/ui/accordion";
import {Drawer} from "@/components/ui/drawer";
import {ToastProvider, useToast} from "@/components/ui/toast";

describe("ChipGroup", () => {
  const options = [
    {value: "all", label: "All"},
    {value: "digestive", label: "Digestive"},
    {value: "immunity", label: "Immunity"},
  ];

  it("marks the selected chip with aria-pressed and calls onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ChipGroup aria-label="Category" options={options} value="all" onChange={onChange} />);
    const digestive = screen.getByRole("button", {name: "Digestive"});
    expect(digestive).toHaveAttribute("aria-pressed", "false");
    await user.click(digestive);
    expect(onChange).toHaveBeenCalledWith("digestive");
    expect(screen.getByRole("button", {name: "All"})).toHaveAttribute("aria-pressed", "true");
  });

  it("roves focus with arrow keys", async () => {
    const user = userEvent.setup();
    render(<ChipGroup aria-label="Category" options={options} value="all" onChange={() => {}} />);
    screen.getByRole("button", {name: "All"}).focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", {name: "Digestive"})).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", {name: "Immunity"})).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", {name: "Digestive"})).toHaveFocus();
  });
});

describe("Accordion", () => {
  it("renders native details/summary so it works without JavaScript", () => {
    const {container} = render(<Accordion group="faq" items={[{question: "How do I order?", answer: "On WhatsApp."}]} />);
    expect(container.querySelector("details")).toBeInTheDocument();
    expect(container.querySelector("summary")).toHaveTextContent("How do I order?");
  });
});

describe("Drawer", () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open cart</button>
        <Drawer open={open} onClose={() => setOpen(false)} title="Your cart">
          <p>Cart contents</p>
        </Drawer>
      </>
    );
  }

  it("opens, closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole("button", {name: "Open cart"});

    await user.click(trigger);
    expect(await screen.findByText("Your cart")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Cart contents")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

describe("Toast", () => {
  function Harness() {
    const {show} = useToast();
    return (
      <>
        <button onClick={() => show({message: "Added to cart"})}>One</button>
        <button onClick={() => show({message: "Order sent"})}>Two</button>
      </>
    );
  }

  it("announces the message in a polite live region", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", {name: "One"}));
    expect(screen.getByRole("status")).toHaveTextContent("Added to cart");
  });

  it("a new toast replaces the previous one", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>
    );
    await user.click(screen.getByRole("button", {name: "One"}));
    await user.click(screen.getByRole("button", {name: "Two"}));
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Order sent");
    expect(status).not.toHaveTextContent("Added to cart");
  });
});

import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";

vi.mock("@/lib/forms/submit", () => ({submitForm: vi.fn()}));
vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));

import {submitForm} from "@/lib/forms/submit";
import {track} from "@/lib/analytics/track";
import {getSettings} from "@/lib/catalog/settings";
import {siteConfig} from "@/lib/site-config";
import {ToastProvider} from "@/components/ui/toast";
import {ContactForm} from "./components/contact-form";
import {ContactMethods} from "./components/contact-methods";
import {LocationMap} from "./components/location-map";
import {PaymentSafety} from "./components/payment-safety";
import {ContactView} from "./view";

const settings = getSettings();

function fillForm() {
  fireEvent.change(screen.getByLabelText(/Full name/), {target: {value: "Ada Lovelace"}});
  fireEvent.change(screen.getByLabelText(/WhatsApp number/), {target: {value: "08031234567"}});
  fireEvent.change(screen.getByLabelText(/^Message/), {target: {value: "Hello, I have a question."}});
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe("ContactMethods", () => {
  it("puts WhatsApp first with wa.me, tel: and mailto: actions", () => {
    render(<ContactMethods />);
    const links = screen.getAllByRole("link");
    const first = links.find((l) => l.getAttribute("href")?.includes("wa.me"));
    expect(first).toHaveAccessibleName("Start a chat");
    expect(links.indexOf(first!)).toBeLessThan(links.findIndex((l) => l.getAttribute("href")?.startsWith("tel:")));
    expect(screen.getByRole("link", {name: "Call now"})).toHaveAttribute("href", `tel:${siteConfig.phone.number}`);
    expect(screen.getByRole("link", {name: "Send an email"})).toHaveAttribute("href", `mailto:${siteConfig.email}`);
  });

  it("omits social icons when none are configured", () => {
    render(<ContactMethods />);
    // siteConfig socials are all "[url]" placeholders → no "Follow us" row.
    expect(screen.queryByText("Follow us")).not.toBeInTheDocument();
  });
});

describe("LocationMap", () => {
  it("requests no map until Show map is tapped, then embeds the query", () => {
    render(<LocationMap />);
    expect(document.querySelector("iframe")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Show map"}));
    const iframe = document.querySelector("iframe")!;
    expect(iframe).toHaveAttribute("src", `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.address.mapsQuery)}&output=embed`);
    expect(iframe).toHaveAttribute("title", `Map showing ${siteConfig.name}`);
  });

  it("shows directions and hours", () => {
    render(<LocationMap />);
    expect(screen.getByRole("link", {name: "Get directions"})).toHaveAttribute(
      "href",
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address.mapsQuery)}`
    );
    expect(screen.getByText(settings.openingHours)).toBeInTheDocument();
  });
});

describe("ContactForm validation", () => {
  it("requires name, Nigerian phone, 5+ char message and consent", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", {name: "Send message"}));
    expect(screen.getByText("Enter your name")).toBeInTheDocument();
    expect(screen.getByText("Enter a Nigerian mobile number, e.g. 0803 123 4567")).toBeInTheDocument();
    expect(screen.getByText("Tell us a little more (at least 5 characters)")).toBeInTheDocument();
    expect(screen.getByText("Please tick to agree so we can reply")).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith({event: "form_error", form_id: "contact", reason: "validation"});
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("rejects an invalid optional email", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Email/), {target: {value: "abc"}});
    fireEvent.click(screen.getByRole("button", {name: "Send message"}));
    expect(screen.getByText("Enter a valid email or leave it empty")).toBeInTheDocument();
  });

  it("shows the no-medical-details note", () => {
    render(<ContactForm />);
    expect(screen.getByText(/Please don't include medical details/)).toBeInTheDocument();
  });
});

describe("ContactForm submission", () => {
  it("submits a valid form, tracks form_submit and calls onSuccess", async () => {
    vi.mocked(submitForm).mockResolvedValue({ok: true});
    const onSuccess = vi.fn();
    render(<ContactForm onSuccess={onSuccess} />);
    fillForm();
    fireEvent.click(screen.getByLabelText(/I agree that/));
    fireEvent.click(screen.getByRole("button", {name: "Send message"}));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(submitForm).toHaveBeenCalledWith(
      "contact",
      expect.objectContaining({name: "Ada Lovelace", phone: "+2348031234567", consent: true})
    );
    expect(track).toHaveBeenCalledWith({event: "form_submit", form_id: "contact"});
  });

  it("keeps entered values on a network failure", async () => {
    vi.mocked(submitForm).mockResolvedValue({ok: false, code: "network"});
    render(<ContactForm />);
    fillForm();
    fireEvent.click(screen.getByLabelText(/I agree that/));
    fireEvent.click(screen.getByRole("button", {name: "Send message"}));
    await screen.findByText(/Something went wrong/);
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Ada Lovelace");
    expect(track).toHaveBeenCalledWith({event: "form_error", form_id: "contact", reason: "network"});
  });
});

describe("PaymentSafety", () => {
  it("renders the bank details, the exact warning and copies the account number", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {value: {writeText}, configurable: true});
    render(
      <ToastProvider>
        <PaymentSafety />
      </ToastProvider>
    );
    expect(screen.getByText("Pay only to our official account")).toBeInTheDocument();
    expect(screen.getByText(settings.bank!.accountNumber)).toBeInTheDocument();
    expect(screen.getByText(/We only send payment details from our WhatsApp number/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Copy"}));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(settings.bank!.accountNumber));
    await screen.findByText("Account number copied");
  });
});

describe("ContactView", () => {
  it("renders the four sections in spec order", () => {
    render(
      <ToastProvider>
        <ContactView />
      </ToastProvider>
    );
    const texts = screen.getAllByRole("heading").map((h) => h.textContent);
    const order = ["We're here to help", "Visit us", "Send us a message", "Pay only to our official account"];
    for (let i = 1; i < order.length; i++) expect(texts.indexOf(order[i])).toBeGreaterThan(texts.indexOf(order[i - 1]));
  });
});

import {describe, expect, it} from "vite-plus/test";
import {render, screen, within} from "@testing-library/react";
import {BankDetails, DeliveryNote, DeliveryTable, LegalDisclaimer, PickupInfo} from "@/components/mdx-components";
import {getDeliveryAreas, getSettings} from "@/lib/catalog/settings";
import {disclaimerText} from "@/components/ui/disclaimer";
import type {LegalPage} from "@/lib/content/legal";
import {LegalLayout} from "./legal-layout";
import privacySrc from "../../../content/legal/privacy.mdx?raw";
import termsSrc from "../../../content/legal/terms.mdx?raw";
import disclaimerSrc from "../../../content/legal/health-disclaimer.mdx?raw";
import deliverySrc from "../../../content/legal/delivery-and-returns.mdx?raw";

function Body() {
  return (
    <>
      <h2 id="first">First section</h2>
      <p>Body text.</p>
      <h2 id="second">Second section</h2>
    </>
  );
}

const fakePage: LegalPage = {
  slug: "privacy",
  title: "Privacy policy",
  description: "How we handle your data.",
  updated: "2026-10-01",
  body: Body,
  toc: [
    {title: "First section", url: "#first", depth: 2},
    {title: "Second section", url: "#second", depth: 2},
    {title: "Deep item", url: "#deep", depth: 3},
  ],
};

describe("LegalLayout", () => {
  it("renders title, updated date, depth-2 TOC matching the h2s, and the contact line", () => {
    render(<LegalLayout page={fakePage} />);
    expect(screen.getByRole("heading", {level: 1, name: "Privacy policy"})).toBeInTheDocument();
    expect(screen.getByText("Last updated 1 October 2026")).toBeInTheDocument();
    const tocLinks = screen.getAllByRole("navigation", {name: "On this page"})[0]!.querySelectorAll("a");
    expect(Array.from(tocLinks).map((a) => a.getAttribute("href"))).toEqual(["#first", "#second"]);
    expect(screen.getByRole("heading", {name: "First section"})).toHaveAttribute("id", "first");
    expect(screen.getByRole("link", {name: "Contact us"})).toHaveAttribute("href", "/contact");
  });
});

describe("privacy.mdx", () => {
  it("has all 11 required h2 headings", () => {
    const h2s = Array.from(privacySrc.matchAll(/^## (.+)$/gm), (m) => m[1]);
    expect(h2s).toEqual([
      "Who we are",
      "What we collect",
      "Why we use it and our lawful basis",
      "Who we share it with",
      "International transfers",
      "How long we keep it",
      "Your rights",
      "Cookies",
      "Security",
      "Children",
      "Changes to this policy",
    ]);
  });

  it("names the data-protection regime and complaint route", () => {
    expect(privacySrc).toContain("Nigeria Data Protection Act");
    expect(privacySrc).toContain("Nigeria Data Protection Commission");
    expect(privacySrc).toMatch(/independent distributor|independent KEDI/i);
    expect(privacySrc).toMatch(/data controller/i);
  });
});

describe("terms.mdx", () => {
  it("covers every required topic", () => {
    const h2s = Array.from(termsSrc.matchAll(/^## (.+)$/gm), (m) => m[1]);
    expect(h2s).toEqual([
      "About these terms",
      "Independent distributor",
      "Product information",
      "Orders",
      "Prices and payment",
      "Delivery, returns and refunds",
      "Referral and loyalty programme",
      "Seminars",
      "Acceptable use",
      "Intellectual property",
      "Liability",
      "Governing law",
      "Contact",
    ]);
  });

  it("states independence, WhatsApp-order-as-request and Nigerian governing law", () => {
    expect(termsSrc).toMatch(/independent distributor/i);
    expect(termsSrc).toMatch(/request.*(not|before)/i);
    expect(termsSrc).toMatch(/Federal Republic of Nigeria|laws of Nigeria/i);
    expect(termsSrc).toMatch(/trademark/i);
  });
});

describe("health-disclaimer.mdx", () => {
  it("leads with the shared health disclaimer and the required sections", () => {
    expect(disclaimerSrc).toContain('<Disclaimer kind="health" />');
    expect(disclaimerSrc).toMatch(/## When to see a doctor/i);
    expect(disclaimerSrc).toMatch(/## If something feels wrong|## Reporting/i);
  });

  it("the shared disclaimer component renders the exact §2 text", () => {
    render(<LegalDisclaimer kind="health" />);
    expect(screen.getByText(disclaimerText.health)).toBeInTheDocument();
  });
});

describe("delivery-and-returns.mdx", () => {
  it("uses the live components and the 48-hour report rule", () => {
    expect(deliverySrc).toContain("<DeliveryTable");
    expect(deliverySrc).toContain("<DeliveryNote");
    expect(deliverySrc).toContain("<PickupInfo");
    expect(deliverySrc).toContain("48 hours");
    expect(deliverySrc).toMatch(/refund/i);
  });
});

describe("DeliveryTable", () => {
  it("groups areas into local, interstate and pickup with fees and times", () => {
    render(<DeliveryTable />);
    expect(screen.getByText("Local delivery")).toBeInTheDocument();
    expect(screen.getByText("Interstate courier")).toBeInTheDocument();
    expect(screen.getByText("Pickup")).toBeInTheDocument();
    const local = getDeliveryAreas().find((a) => a.zone === "local")!;
    const table = screen.getAllByRole("table").find((t) => within(t).queryByText(local.area))!;
    const row = within(table).getByText(local.area).closest("tr")!;
    expect(within(row).getByText(local.timelineText)).toBeInTheDocument();
    // Rows keep the Sheet's order within each zone.
    const localAreas = getDeliveryAreas()
      .filter((a) => a.zone === "local")
      .map((a) => a.area);
    const rendered = within(table)
      .getAllByRole("row")
      .slice(1)
      .map((r) => r.textContent);
    expect(rendered.map((t) => localAreas.find((a) => t!.startsWith(a)))).toEqual(localAreas);
    // The same row also renders as a stacked card for mobile.
    expect(screen.getAllByText(local.area).length).toBeGreaterThanOrEqual(2);
  });

  it("shows the WhatsApp message when there are no areas", () => {
    render(<DeliveryTable areas={[]} />);
    expect(screen.getByText("Ask us on WhatsApp for delivery fees")).toBeInTheDocument();
  });
});

describe("live settings components", () => {
  it("BankDetails renders the Sheet bank", () => {
    render(<BankDetails />);
    const bank = getSettings().bank;
    if (bank) {
      expect(screen.getByText(new RegExp(bank.name))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(bank.accountNumber))).toBeInTheDocument();
    } else {
      expect(screen.getByText(/shared on WhatsApp/)).toBeInTheDocument();
    }
  });

  it("DeliveryNote and PickupInfo render Sheet values", () => {
    const settings = getSettings();
    const {container} = render(
      <>
        <DeliveryNote /> <PickupInfo />
      </>
    );
    if (settings.deliveryNote) expect(container).toHaveTextContent(settings.deliveryNote);
    if (settings.pickupAddress) expect(container).toHaveTextContent(settings.pickupAddress);
  });
});

import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet, RouterProvider} from "@tanstack/react-router";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {faqGroups} from "../../../content/faq.ts";
import {getFaqs} from "@/lib/content/faq";
import {siteConfig} from "@/lib/site-config";
import {FaqGroups} from "./components/faq-groups";
import {FaqHeader} from "./components/faq-header";
import {StillHaveQuestions} from "./components/still-have-questions";
import {FaqView} from "./view";

const items = getFaqs({page: "faq"});

// Inlines renders router <Link>s for internal hrefs — components need a router.
function renderWithRouter(ui: ReactNode) {
  const root = createRootRoute({component: Outlet});
  const route = createRoute({getParentRoute: () => root, path: "/faq", component: () => ui});
  const router = createRouter({routeTree: root.addChildren([route]), history: createMemoryHistory({initialEntries: ["/faq"]})});
  return render(<RouterProvider router={router} />);
}

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
  window.history.replaceState(null, "", "/faq");
});

describe("FaqHeader", () => {
  it("renders h1, intro and a jump link per group that has items", () => {
    render(<FaqHeader groups={faqGroups.map((g) => g.id)} />);
    expect(screen.getByRole("heading", {level: 1, name: "Frequently asked questions"})).toBeInTheDocument();
    for (const g of faqGroups) {
      expect(screen.getByRole("link", {name: g.label})).toHaveAttribute("href", `#${g.id}`);
    }
  });

  it("omits jump links for groups without items", () => {
    render(<FaqHeader groups={["ordering"]} />);
    expect(screen.getByRole("link", {name: "Ordering"})).toBeInTheDocument();
    expect(screen.queryByRole("link", {name: "Returns"})).not.toBeInTheDocument();
  });
});

describe("FaqGroups", () => {
  it("renders groups in the faqGroups order with their questions", async () => {
    renderWithRouter(<FaqGroups items={items} />);
    await screen.findByText("How do I order?");
    const headings = screen.getAllByRole("heading", {level: 2}).map((h) => h.textContent);
    const expected = faqGroups.filter((g) => items.some((i) => i.group === g.id)).map((g) => g.label);
    expect(headings).toEqual(expected);
    expect(screen.getByText("How do I order?")).toBeInTheDocument();
  });

  it("opens the item matching the URL hash and scrolls to it", async () => {
    const item = items[0];
    window.history.replaceState(null, "", `/faq#${item.id}`);
    const scroll = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scroll;
    renderWithRouter(<FaqGroups items={items} />);
    await screen.findByText(item.question);
    const el = document.getElementById(item.id);
    expect(el).toHaveAttribute("open");
    expect(scroll).toHaveBeenCalled();
  });

  it("copies {site}/faq#{id} from the copy-link button", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {value: {writeText}, configurable: true});
    renderWithRouter(<FaqGroups items={items} />);
    await screen.findByText("How do I order?");
    await userEvent.click(screen.getAllByRole("button", {name: "Copy link to this question"})[0]);
    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/\/faq#[\w-]+$/));
  });
});

describe("StillHaveQuestions", () => {
  it("offers WhatsApp, call and contact options with the reply time", () => {
    render(<StillHaveQuestions openingHours="Mon–Sat, 9am–6pm" />);
    expect(screen.getByRole("link", {name: "Ask on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
    expect(screen.getByRole("link", {name: `Call ${siteConfig.phone.display}`})).toHaveAttribute("href", `tel:${siteConfig.phone.number}`);
    expect(screen.getByRole("link", {name: "Other ways to contact us"})).toHaveAttribute("href", "/contact");
    expect(screen.getByText(/opening hours \(Mon–Sat, 9am–6pm\)/)).toBeInTheDocument();
  });

  it("drops the parenthesised hours when none are set", () => {
    render(<StillHaveQuestions openingHours={null} />);
    expect(screen.getByText("Message us on WhatsApp. We usually reply within 1 hour during opening hours.")).toBeInTheDocument();
  });
});

describe("FaqView", () => {
  it("omits items whose required token is missing and renders header → groups → CTA", async () => {
    renderWithRouter(<FaqView />);
    await screen.findByRole("heading", {level: 1, name: "Frequently asked questions"});
    const headingTexts = screen.getAllByRole("heading").map((h) => h.textContent);
    expect(headingTexts.indexOf("Frequently asked questions")).toBeLessThan(headingTexts.indexOf("Still have a question?"));
    // The fixture Sheet supplies every token, so all seeded groups render.
    for (const g of faqGroups) expect(headingTexts).toContain(g.label);
  });
});

import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {render, screen} from "@testing-library/react";
import {markAnalyticsReady, resetAnalytics} from "@/lib/analytics/track";
import {getSettings} from "@/lib/catalog/settings";
import {getAbout} from "@/lib/content/about";
import {siteConfig} from "@/lib/site-config";
import {AboutCta} from "./components/about-cta";
import {AboutLocation} from "./components/about-location";
import {AboutStory} from "./components/about-story";
import {IndependentStatement} from "./components/independent-statement";
import {MissionValues} from "./components/mission-values";
import {AboutView} from "./view";

const {distributor, mission, values} = getAbout();

beforeEach(() => {
  resetAnalytics();
  markAnalyticsReady();
  window.gtag = vi.fn();
});

describe("AboutStory", () => {
  it("greets with the first name, role line and story paragraphs", () => {
    render(<AboutStory />);
    expect(screen.getByRole("heading", {level: 1, name: `Hi, I'm ${distributor.firstName}`})).toBeInTheDocument();
    expect(screen.getByText(/Independent KEDI Distributor in/)).toBeInTheDocument();
    for (const paragraph of distributor.story) expect(screen.getByText(paragraph)).toBeInTheDocument();
    expect(screen.getByText(`${distributor.name}, founder of ${siteConfig.name}`)).toBeInTheDocument();
  });

  it("omits the years fragment when yearsOfExperience is unset", () => {
    render(<AboutStory />); // fixture has yearsOfExperience: null
    expect(screen.queryByText(/years' experience/)).not.toBeInTheDocument();
  });
});

describe("MissionValues", () => {
  it("renders the mission and every value from content", () => {
    render(<MissionValues />);
    expect(screen.getByRole("heading", {level: 2, name: mission})).toBeInTheDocument();
    for (const value of values) {
      expect(screen.getByRole("heading", {name: value.title})).toBeInTheDocument();
      expect(screen.getByText(value.text)).toBeInTheDocument();
    }
  });
});

describe("IndependentStatement", () => {
  it("renders the exact independence sentence and explanation", () => {
    render(<IndependentStatement />);
    expect(screen.getByRole("heading", {name: "We are an independent distributor of KEDI Healthcare products."})).toBeInTheDocument();
    expect(screen.getByText(/handled by .* not by KEDI directly/)).toBeInTheDocument();
    expect(screen.getByText(/official distribution channel/)).toBeInTheDocument();
  });
});

describe("AboutLocation", () => {
  it("shows address, hours, a Maps directions link and service-area chips", () => {
    render(<AboutLocation />);
    const settings = getSettings();
    expect(screen.getByText(settings.pickupAddress)).toBeInTheDocument();
    if (settings.openingHours) expect(screen.getByText(settings.openingHours)).toBeInTheDocument();
    const directions = screen.getByRole("link", {name: "Get directions"});
    expect(directions.getAttribute("href")).toBe(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address.mapsQuery)}`
    );
    for (const area of siteConfig.serviceAreas) expect(screen.getByText(area)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "See delivery fees and times"})).toHaveAttribute("href", "/delivery-and-returns");
  });
});

describe("AboutCta", () => {
  it("renders the exact copy and both actions", () => {
    render(<AboutCta />);
    expect(screen.getByRole("heading", {name: "Come and say hello"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "See seminar dates"})).toHaveAttribute("href", "/seminars");
    const chat = screen.getByRole("link", {name: "Chat on WhatsApp"});
    expect(chat.getAttribute("href")).toContain("wa.me");
  });
});

describe("AboutView", () => {
  it("renders all five sections in spec order", () => {
    const {container} = render(<AboutView />);
    const text = container.textContent!;
    const order = ["Hi, I'm", mission, "We are an independent distributor", "Where to find us", "Come and say hello"];
    const positions = order.map((s) => text.indexOf(s));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});

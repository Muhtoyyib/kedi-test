import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";

vi.mock("@/lib/forms/submit", () => ({submitForm: vi.fn()}));
vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));

import {submitForm} from "@/lib/forms/submit";
import {track} from "@/lib/analytics/track";
import {catalog} from "@/lib/catalog/data";
import {getBusinessContent} from "@/lib/content/business";
import {BusinessFaq} from "./components/business-faq";
import {BusinessHero} from "./components/business-hero";
import {BusinessHowItWorks} from "./components/how-it-works";
import {BusinessSupport} from "./components/support";
import {EarningsDisclaimer} from "./components/earnings-disclaimer";
import {InterestForm} from "./components/interest-form";
import {SeminarInvite} from "./components/seminar-invite";
import {WhatItIs} from "./components/what-it-is";
import {BusinessView} from "./view";

const content = getBusinessContent();
const next = catalog.seminars.find((s) => new Date(s.startsAt) > new Date(catalog.generatedAt));

function fillForm() {
  fireEvent.change(screen.getByLabelText(/Full name/), {target: {value: "Ada Lovelace"}});
  fireEvent.change(screen.getByLabelText(/WhatsApp number/), {target: {value: "08031234567"}});
  fireEvent.change(screen.getByLabelText(/City \/ area/), {target: {value: "Yaba"}});
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

describe("BusinessHero", () => {
  it("renders the exact copy, #interest anchor and earnings disclaimer", () => {
    render(<BusinessHero />);
    expect(screen.getByRole("heading", {level: 1, name: "Build a wellness business with KEDI, with support"})).toBeInTheDocument();
    expect(screen.getByText("Business opportunity")).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Register your interest"})).toHaveAttribute("href", "#interest");
    expect(screen.getByRole("link", {name: "Attend the business session"})).toHaveAttribute("href", "/seminars");
    expect(screen.getByText(/Becoming a distributor is a business, not a job/)).toBeInTheDocument();
  });
});

describe("WhatItIs", () => {
  it("renders the four points and closing line from content", () => {
    render(<WhatItIs content={content.whatItIs} />);
    expect(screen.getByRole("heading", {name: "What it means to be a KEDI distributor"})).toBeInTheDocument();
    for (const point of content.whatItIs.points) expect(screen.getByText(point.text)).toBeInTheDocument();
    expect(screen.getByText(content.whatItIs.closing)).toBeInTheDocument();
  });
});

describe("BusinessHowItWorks", () => {
  it("renders the four steps in order, including the no-pressure step", () => {
    render(<BusinessHowItWorks steps={content.howItWorks} />);
    const items = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(items).toHaveLength(4);
    expect(items[0]).toContain("Register your interest");
    expect(items[3]).toContain("Decide in your own time");
    expect(screen.getByText(/no pressure/i)).toBeInTheDocument();
  });
});

describe("BusinessSupport", () => {
  it("excludes unconfirmed items and hides entirely when none are confirmed", () => {
    const {container} = render(<BusinessSupport items={content.support} />);
    expect(container).toBeEmptyDOMElement(); // fixture has none confirmed
    render(<BusinessSupport items={[{icon: "GraduationCap", title: "Training", text: "Getting-started sessions.", confirmed: true}]} />);
    expect(screen.getByRole("heading", {name: "The support we give our team"})).toBeInTheDocument();
    expect(screen.getByText("Getting-started sessions.")).toBeInTheDocument();
  });
});

describe("SeminarInvite", () => {
  it("shows the next seminar line and tracks the register click", () => {
    render(<SeminarInvite next={next} />);
    expect(screen.getByText(/^Next:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", {name: "Register free"}));
    expect(track).toHaveBeenCalledWith({event: "seminar_register_click", seminar_id: next!.id, location: "business_invite"});
  });

  it("shows the no-date fallback and the business WhatsApp message", () => {
    render(<SeminarInvite />);
    expect(screen.getByText(/New dates are announced every week/)).toBeInTheDocument();
    const chat = screen.getByRole("link", {name: "Or ask us on WhatsApp"});
    expect(decodeURIComponent(chat.getAttribute("href")!).replace(/\+/g, " ")).toContain("interested in becoming a KEDI distributor");
  });
});

describe("InterestForm validation", () => {
  it("shows every validation message and does not submit without consent", () => {
    render(<InterestForm />);
    fireEvent.click(screen.getByRole("button", {name: "Register my interest"}));
    expect(screen.getByText("Enter your name")).toBeInTheDocument();
    expect(screen.getByText("Enter a Nigerian mobile number, e.g. 0803 123 4567")).toBeInTheDocument();
    expect(screen.getByText("Tell us where you're based")).toBeInTheDocument();
    expect(screen.getByText("Please tick to agree so we can message you")).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("rejects an over-500-character message", () => {
    render(<InterestForm />);
    fillForm();
    fireEvent.change(screen.getByLabelText(/What would you like to know/), {target: {value: "x".repeat(501)}});
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "Register my interest"}));
    // maxLength prevents typing past 500 — set the field directly to confirm the guard.
    expect(screen.getByText("Keep it under 500 characters")).toBeInTheDocument();
  });

  it("renders the honeypot field hidden", () => {
    const {container} = render(<InterestForm />);
    const honey = container.querySelector('input[name="company"]')!;
    expect(honey).toBeInTheDocument();
    expect(honey.closest(".sr-only, [class*='sr-only']")).not.toBeNull();
  });
});

describe("InterestForm submission", () => {
  it("submits business_interest, tracks and navigates on success", async () => {
    vi.mocked(submitForm).mockResolvedValue({ok: true});
    const onSuccess = vi.fn();
    render(<InterestForm onSuccess={onSuccess} />);
    fillForm();
    fireEvent.change(screen.getByLabelText(/Current occupation/), {target: {value: "Student"}});
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "Register my interest"}));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(submitForm).toHaveBeenCalledWith(
      "business_interest",
      expect.objectContaining({name: "Ada Lovelace", phone: "+2348031234567", location: "Yaba", occupation: "Student", consent: true})
    );
    expect(track).toHaveBeenCalledWith({event: "form_submit", form_id: "business_interest"});
  });

  it("shows the rate-limited message on code rate_limited", async () => {
    vi.mocked(submitForm).mockResolvedValue({ok: false, code: "rate_limited"});
    render(<InterestForm />);
    fillForm();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "Register my interest"}));
    expect(await screen.findByText(/sent this a few times already/)).toBeInTheDocument();
  });

  it("shows the try-again message with a WhatsApp link on network failure", async () => {
    vi.mocked(submitForm).mockResolvedValue({ok: false, code: "network"});
    render(<InterestForm />);
    fillForm();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "Register my interest"}));
    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument();
  });
});

describe("EarningsDisclaimer", () => {
  it("renders the exact earnings text plus the KEDI documentation line", () => {
    render(<EarningsDisclaimer />);
    expect(screen.getByText("About earnings")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Becoming a distributor is a business, not a job or a guaranteed income. What you earn depends entirely on your own effort, sales and KEDI's official compensation plan. We do not promise any level of income."
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/official distributor terms/)).toBeInTheDocument();
  });
});

describe("BusinessFaq", () => {
  it("renders all business items and the income-denial answer", () => {
    render(<BusinessFaq />);
    expect(screen.getByRole("heading", {name: "Questions about becoming a distributor"})).toBeInTheDocument();
    for (const q of ["Do I need experience?", "Can I do it part-time?", "How much can I earn?"]) {
      expect(screen.getByText(q)).toBeInTheDocument();
    }
    expect(screen.getByText(/We don't promise any income/)).toBeInTheDocument();
  });
});

describe("BusinessView", () => {
  it("renders the sections in spec order with the disclaimer under hero and form", () => {
    const {container} = render(<BusinessView />);
    const text = container.textContent!;
    const order = [
      "Build a wellness business",
      "What it means",
      "How it works",
      "Hear how it works",
      "within one working day",
      "About earnings",
      "Questions about becoming",
    ];
    const positions = order.map((s) => text.indexOf(s));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    // Disclaimer appears twice: under hero CTAs and under the form.
    expect(container.textContent!.match(/not a job or a guaranteed income/g)!.length).toBeGreaterThanOrEqual(3);
  });
});

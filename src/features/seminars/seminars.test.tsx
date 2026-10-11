import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {getSeminars} from "@/lib/catalog/seminars";
import {getHighlights} from "@/lib/catalog/highlights";
import {getFaqs} from "@/lib/content/faq";

vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));
vi.mock("@/lib/forms/submit", () => ({submitForm: vi.fn()}));
import {track} from "@/lib/analytics/track";
import {submitForm} from "@/lib/forms/submit";

import {SeminarHero} from "./components/seminar-hero";
import {LumaEmbed} from "./components/luma-embed";
import {SeminarInterestForm} from "./components/interest-form";
import {Registration} from "./components/registration";
import {WhatYoullLearn} from "./components/what-youll-learn";
import {Host} from "./components/host";
import {UpcomingAndCalendar} from "./components/upcoming";
import {PastHighlights} from "./components/past-highlights";
import {SeminarFaq} from "./components/seminar-faq";
import {SeminarsView} from "./view";

const seminars = getSeminars();
const physical = seminars.find((s) => s.id === "SEM-NEXT")!;
const online = seminars.find((s) => s.id === "SEM-LATER")!;

beforeEach(() => {
  vi.clearAllMocks();
  window.location.hash = "";
});

describe("SeminarHero", () => {
  const beforeSeminar = new Date("2026-10-15T10:00:00+01:00");

  it("shows the topic, meta lines, duration and audience for a physical seminar", () => {
    render(<SeminarHero seminar={physical} now={beforeSeminar} hydrated />);
    expect(screen.getByRole("heading", {level: 1, name: physical.topic})).toBeInTheDocument();
    expect(screen.getByText("Saturday, 17 October")).toBeInTheDocument();
    expect(screen.getByText(/4:00 PM – 5:30 PM WAT \(1 hr 30 min\)/)).toBeInTheDocument();
    expect(screen.getByText(/Fixture Hall, Surulere/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Get directions"})).toHaveAttribute("href", expect.stringContaining("google.com/maps"));
    expect(screen.getByText(/Who should attend: Working adults/)).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("In person")).toBeInTheDocument();
  });

  it("shows the online meta line for an online seminar", () => {
    render(<SeminarHero seminar={online} now={beforeSeminar} hydrated />);
    expect(screen.getByText(/Online: YouTube Live — link sent after you register/)).toBeInTheDocument();
    expect(screen.queryByRole("link", {name: "Get directions"})).not.toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("computes the countdown text from now", () => {
    render(<SeminarHero seminar={physical} now={new Date("2026-10-16T10:00:00+01:00")} hydrated />);
    expect(screen.getByText("Starts in 2 days")).toBeInTheDocument();
  });

  it("shows 'Starts today' on the seminar day and 'Starting soon' after it starts", () => {
    const {unmount} = render(<SeminarHero seminar={physical} now={new Date("2026-10-17T10:00:00+01:00")} hydrated />);
    expect(screen.getByText("Starts today at 4:00 PM")).toBeInTheDocument();
    unmount();
    render(<SeminarHero seminar={physical} now={new Date("2026-10-17T16:30:00+01:00")} hydrated />);
    expect(screen.getByText("Starting soon")).toBeInTheDocument();
  });
});

describe("SeminarHero states and actions", () => {
  const beforeSeminar = new Date("2026-10-15T10:00:00+01:00");

  it("shows the coming-soon state when no seminar is scheduled", () => {
    render(<SeminarHero seminar={undefined} now={beforeSeminar} hydrated />);
    expect(screen.getByRole("heading", {level: 1, name: "Our next seminar date is coming soon"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Get notified of every seminar"})).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", {name: "Ask us on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });

  it("loads the registration embed and tracks when Register is tapped", () => {
    render(
      <>
        <SeminarHero seminar={physical} now={beforeSeminar} hydrated />
        <LumaEmbed eventId={physical.lumaEventId} topic={physical.topic} lumaUrl={physical.lumaUrl} onError={vi.fn()} />
      </>
    );
    expect(document.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getAllByRole("link", {name: "Register free"})[0]);
    expect(track).toHaveBeenCalledWith({event: "seminar_register_click", seminar_id: "SEM-NEXT", location: "seminar_hero"});
    expect(document.querySelector("iframe")).not.toBeNull();
  });

  it("falls back to a WhatsApp share when navigator.share is unavailable", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<SeminarHero seminar={physical} now={beforeSeminar} hydrated />);
    fireEvent.click(screen.getByRole("button", {name: "Share with a friend"}));
    expect(open).toHaveBeenCalledWith(expect.stringContaining("https://wa.me/?text="), "_blank", "noopener");
    expect(track).toHaveBeenCalledWith({event: "seminar_share", method: "whatsapp"});
  });
});

describe("LumaEmbed", () => {
  const props = {eventId: physical.lumaEventId, topic: physical.topic, lumaUrl: physical.lumaUrl, onError: vi.fn()};

  it("mounts no iframe until Register is tapped", () => {
    render(<LumaEmbed {...props} />);
    expect(document.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", {name: "Register free"}));
    const iframe = document.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", "https://lu.ma/embed/event/evt-fixture-next/simple");
    expect(iframe).toHaveAttribute("title", `Register for ${physical.topic}`);
  });

  it("auto-loads when arriving on #register", () => {
    window.location.hash = "#register";
    render(<LumaEmbed {...props} />);
    expect(document.querySelector("iframe")).not.toBeNull();
  });

  it("calls onError after the 10 s watchdog", () => {
    vi.useFakeTimers();
    try {
      const onError = vi.fn();
      render(<LumaEmbed {...props} onError={onError} />);
      fireEvent.click(screen.getByRole("button", {name: "Register free"}));
      act(() => void vi.advanceTimersByTime(10_000));
      expect(onError).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Registration", () => {
  it("shows the interest form when the seminar has no event ID", () => {
    render(<Registration seminar={{...physical, lumaEventId: ""}} />);
    expect(screen.getByRole("heading", {name: "Leave your details and we'll register you"})).toBeInTheDocument();
  });

  it("shows the four what-happens-next steps and the consent note", () => {
    render(<Registration seminar={physical} />);
    expect(screen.getByText("Save our WhatsApp number when we message you, so you get the link and reminders.")).toBeInTheDocument();
    expect(screen.getByText(/Reply STOP anytime/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Or open the registration page"})).toHaveAttribute("href", physical.lumaUrl);
  });
});

describe("SeminarInterestForm", () => {
  it("blocks submit without consent and shows the consent error", () => {
    render(<SeminarInterestForm seminarId="SEM-NEXT" />);
    fireEvent.change(screen.getByLabelText(/^Name/), {target: {value: "Ada"}});
    fireEvent.change(screen.getByLabelText(/WhatsApp number/), {target: {value: "08031234567"}});
    fireEvent.click(screen.getByRole("button", {name: "Send my details"}));
    expect(screen.getByText("Please tick to agree so we can message you")).toBeInTheDocument();
    expect(submitForm).not.toHaveBeenCalled();
  });

  it("submits, tracks form_submit and calls onSuccess", async () => {
    vi.mocked(submitForm).mockResolvedValue({ok: true});
    const onSuccess = vi.fn();
    render(<SeminarInterestForm seminarId="SEM-NEXT" onSuccess={onSuccess} />);
    fireEvent.change(screen.getByLabelText(/^Name/), {target: {value: "Ada"}});
    fireEvent.change(screen.getByLabelText(/WhatsApp number/), {target: {value: "08031234567"}});
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "Send my details"}));
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(submitForm).toHaveBeenCalledWith(
      "seminar_interest",
      expect.objectContaining({name: "Ada", phone: "+2348031234567", seminarId: "SEM-NEXT", consent: true})
    );
    expect(track).toHaveBeenCalledWith({event: "form_submit", form_id: "seminar_interest"});
  });

  it("shows the error notice when the submit fails", async () => {
    vi.mocked(submitForm).mockResolvedValue({ok: false, code: "network"});
    render(<SeminarInterestForm seminarId="SEM-NEXT" />);
    fireEvent.change(screen.getByLabelText(/^Name/), {target: {value: "Ada"}});
    fireEvent.change(screen.getByLabelText(/WhatsApp number/), {target: {value: "08031234567"}});
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "Send my details"}));
    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: /message us on WhatsApp/})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});

describe("WhatYoullLearn", () => {
  it("lists the seminar's own learn points and the offer notice", () => {
    render(<WhatYoullLearn seminar={physical} offerText="10% off on the day." />);
    for (const p of physical.learnPoints) expect(screen.getByText(p)).toBeInTheDocument();
    expect(screen.getByText(/seminar-only offer: 10% off on the day\./)).toBeInTheDocument();
    expect(screen.getByText(/There's no pressure to buy\./)).toBeInTheDocument();
  });

  it("falls back to the standard points and hides the offer when unset", () => {
    render(<WhatYoullLearn seminar={undefined} offerText={null} />);
    expect(screen.getByText("Simple daily habits that support your wellbeing")).toBeInTheDocument();
    expect(screen.queryByText(/seminar-only offer/)).not.toBeInTheDocument();
  });
});

describe("Host", () => {
  it("renders the host name, role, bio and a first-name WhatsApp action", () => {
    render(<Host />);
    expect(screen.getByText("[Distributor Name]")).toBeInTheDocument();
    expect(screen.getByText("Independent KEDI Distributor in [City]")).toBeInTheDocument();
    expect(screen.getByText(/\[Host biography/)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Chat with [Distributor First Name] on WhatsApp"})).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me")
    );
  });
});

describe("UpcomingAndCalendar", () => {
  const now = new Date("2026-10-15T10:00:00+01:00");

  it("lists later seminars with a Register link to each Luma page", () => {
    render(<UpcomingAndCalendar upcoming={[online]} now={now} />);
    const register = screen.getByRole("link", {name: "Register"});
    expect(register).toHaveAttribute("href", online.lumaUrl);
    expect(register).toHaveAttribute("target", "_blank");
    fireEvent.click(register);
    expect(track).toHaveBeenCalledWith({event: "seminar_register_click", seminar_id: "SEM-LATER", location: "upcoming_list"});
  });

  it("shows the empty text and a tracked calendar subscribe button", () => {
    render(<UpcomingAndCalendar upcoming={[]} now={now} />);
    expect(screen.getByText("More dates will be added soon.")).toBeInTheDocument();
    const subscribe = screen.getByRole("link", {name: "Get notified of every seminar"});
    expect(subscribe).toHaveAttribute("target", "_blank");
    fireEvent.click(subscribe);
    expect(track).toHaveBeenCalledWith({event: "calendar_subscribe_click"});
  });
});

describe("PastHighlights", () => {
  const highlights = getHighlights(3);

  it("is hidden when there are no highlights", () => {
    expect(render(<PastHighlights highlights={[]} />).container.firstChild).toBeNull();
  });

  it("renders newest-first highlights with clip facades and comments", () => {
    render(<PastHighlights highlights={highlights} />);
    expect(screen.getByText("Everyday Wellness Basics")).toBeInTheDocument();
    // the clip is a click-to-load facade, not an iframe
    expect(document.querySelector("iframe")).toBeNull();
    expect(screen.getByText(/Fixture comment — the practical tips made it easy/)).toBeInTheDocument();
  });
});

describe("SeminarFaq", () => {
  it("renders every seminar question and the WhatsApp ask link", () => {
    const faqs = getFaqs({page: "seminars"});
    render(<SeminarFaq faqs={faqs} />);
    for (const f of faqs) expect(screen.getByText(f.question)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Ask on WhatsApp"})).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});

describe("SeminarsView", () => {
  it("renders all seven sections in order", () => {
    render(<SeminarsView />);
    const text = document.body.textContent ?? "";
    const order = ["Register here. It's free.", "What you'll learn", "Your host", "Coming up", "Seminar questions"];
    const positions = order.map((f) => text.indexOf(f));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(document.getElementById("register")).not.toBeNull();
    // highlights sit between upcoming and FAQs
    expect(text.indexOf("Past seminar highlights")).toBeGreaterThan(text.indexOf("Coming up"));
    expect(text.indexOf("Past seminar highlights")).toBeLessThan(text.indexOf("Seminar questions"));
  });
});

import {describe, expect, it, vi} from "vite-plus/test";
import {act, fireEvent, render, screen} from "@testing-library/react";
import type {ReactNode} from "react";
import {dismiss} from "@/lib/announcement";
import {setConsent} from "@/lib/consent";
import {AnnouncementBar} from "@/components/layout/site/announcement-bar";
import {CookieConsent} from "@/components/layout/site/cookie-consent";
import {FloatingWhatsApp} from "@/components/layout/site/floating-whatsapp";
import {SiteFooter} from "@/components/layout/site/footer";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";

const waHref = buildWhatsAppLink(generalChatMessage());
const text = "Fixture announcement — free delivery week inside Surulere.";

let currentPath = "/";
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tanstack/react-router")>();
  return {...mod, useLocation: () => ({pathname: currentPath})};
});

function renderAt(ui: ReactNode, path = "/") {
  currentPath = path;
  return render(ui);
}

describe("AnnouncementBar", () => {
  it("renders nothing without an announcement", () => {
    const {container} = renderAt(<AnnouncementBar announcement={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the text and a link when set", () => {
    renderAt(<AnnouncementBar announcement={{text, href: "/seminars"}} />);
    expect(screen.getByRole("link", {name: /free delivery week/})).toHaveAttribute("href", "/seminars");
  });

  it("hides after dismiss and stays hidden for the same message", async () => {
    const {unmount} = renderAt(<AnnouncementBar announcement={{text, href: null}} />);
    fireEvent.click(screen.getByRole("button", {name: "Dismiss announcement"}));
    expect(screen.queryByText(/free delivery/)).not.toBeInTheDocument();
    unmount();
    renderAt(<AnnouncementBar announcement={{text, href: null}} />);
    await act(async () => {});
    expect(screen.queryByText(/free delivery/)).not.toBeInTheDocument();
  });

  it("a new message reappears after an old dismissal", async () => {
    dismiss(window.localStorage, "old text", Date.now());
    renderAt(<AnnouncementBar announcement={{text: "a different announcement", href: null}} />);
    await act(async () => {});
    expect(screen.getByText("a different announcement")).toBeInTheDocument();
  });
});

describe("FloatingWhatsApp", () => {
  it("links to the general chat message and tracks location", () => {
    renderAt(<FloatingWhatsApp />);
    expect(screen.getByRole("link", {name: "Chat with us on WhatsApp"})).toHaveAttribute("href", waHref);
  });

  it("renders nothing when hidden", () => {
    renderAt(<FloatingWhatsApp hidden />);
    expect(screen.queryByRole("link", {name: "Chat with us on WhatsApp"})).not.toBeInTheDocument();
  });

  it("shows the help bubble once per session after 20s", () => {
    vi.useFakeTimers();
    try {
      renderAt(<FloatingWhatsApp />);
      act(() => vi.advanceTimersByTime(20_000));
      expect(screen.getByText("Need help choosing? Chat with us")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", {name: "Hide message"}));
      expect(screen.queryByText("Need help choosing? Chat with us")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("never shows the bubble after prior shell activity", () => {
    vi.useFakeTimers();
    try {
      window.sessionStorage.setItem("wa-bubble-seen", "1");
      renderAt(<FloatingWhatsApp />);
      act(() => vi.advanceTimersByTime(60_000));
      expect(screen.queryByText("Need help choosing? Chat with us")).not.toBeInTheDocument();
      window.sessionStorage.clear();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("CookieConsent", () => {
  it("shows when no choice is stored, then Accept stores and hides", () => {
    renderAt(<CookieConsent />);
    const region = screen.getByRole("region", {name: "Cookie consent"});
    expect(region).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Privacy policy"})).toHaveAttribute("href", "/privacy");
    fireEvent.click(screen.getByRole("button", {name: "Accept"}));
    expect(window.localStorage.getItem("cookie-consent")).toContain("true");
    expect(screen.queryByRole("region", {name: "Cookie consent"})).not.toBeInTheDocument();
  });

  it("Decline stores false", () => {
    renderAt(<CookieConsent />);
    fireEvent.click(screen.getByRole("button", {name: "Decline"}));
    expect(window.localStorage.getItem("cookie-consent")).toContain("false");
    expect(screen.queryByRole("region", {name: "Cookie consent"})).not.toBeInTheDocument();
  });

  it("does not show for a remembered choice", () => {
    setConsent(window.localStorage, true, Date.now());
    renderAt(<CookieConsent />);
    expect(screen.queryByRole("region", {name: "Cookie consent"})).not.toBeInTheDocument();
  });

  it("reopens from the footer Cookie settings control", () => {
    setConsent(window.localStorage, false, Date.now());
    renderAt(
      <>
        <CookieConsent />
        <SiteFooter />
      </>
    );
    fireEvent.click(screen.getByRole("button", {name: "Cookie settings"}));
    expect(screen.getByRole("region", {name: "Cookie consent"})).toBeInTheDocument();
  });
});

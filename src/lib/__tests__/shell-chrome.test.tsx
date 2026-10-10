import {describe, expect, it, vi} from "vite-plus/test";
import {render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type {ReactNode} from "react";
import {SiteLayout} from "@/components/layout/site/layout";
import {SiteHeader} from "@/components/layout/site/site-header";
import {MobileMenu} from "@/components/layout/site/mobile-menu";
import {SiteFooter} from "@/components/layout/site/footer";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {siteConfig} from "@/lib/site-config";

const waHref = buildWhatsAppLink(generalChatMessage());

// Shell components read the active path via useLocation; stub it instead of
// standing up a router.
let currentPath = "/";
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tanstack/react-router")>();
  return {...mod, useLocation: () => ({pathname: currentPath})};
});

function renderAt(ui: ReactNode, path = "/") {
  currentPath = path;
  return render(ui);
}

describe("SiteLayout", () => {
  it("renders the landmark frame with a skip link to #main", () => {
    renderAt(
      <SiteLayout>
        <p>content</p>
      </SiteLayout>
    );
    expect(screen.getAllByRole("banner")).toHaveLength(1);
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
    const skip = screen.getByRole("link", {name: "Skip to content"});
    expect(skip).toHaveAttribute("href", "#main");
    expect(document.getElementById("main")).toHaveAttribute("tabindex", "-1");
  });

  it("hides the floating button when the page opts out", () => {
    renderAt(
      <SiteLayout hideFloatingWhatsApp>
        <p>x</p>
      </SiteLayout>
    );
    // Only the header icon button remains — the floating one is gone.
    expect(screen.getAllByRole("link", {name: "Chat with us on WhatsApp"})).toHaveLength(1);
  });
});

describe("SiteHeader", () => {
  it("shows the brand name and independent-distributor subline", () => {
    renderAt(<SiteHeader menuOpen={false} onMenuOpenChange={() => {}} />);
    const home = screen.getByRole("link", {name: `${siteConfig.name} home`});
    expect(home).toHaveAttribute("href", "/");
    expect(within(home).getByText("Independent KEDI Distributor")).toBeInTheDocument();
  });

  it("offers WhatsApp, cart and menu actions", () => {
    renderAt(<SiteHeader menuOpen={false} onMenuOpenChange={() => {}} />);
    const wa = screen.getAllByRole("link", {name: "Chat with us on WhatsApp"})[0];
    expect(wa).toHaveAttribute("href", waHref);
    expect(screen.getByRole("button", {name: "Cart, 0 items"})).toBeInTheDocument();
    const menu = screen.getByRole("button", {name: "Open menu"});
    expect(menu).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("aria-controls", "mobile-menu");
  });

  it("marks the current section in the desktop nav", () => {
    renderAt(<SiteHeader menuOpen={false} onMenuOpenChange={() => {}} />, "/shop/digestion");
    expect(screen.getByRole("link", {name: "Shop"})).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", {name: "Learn"})).not.toHaveAttribute("aria-current");
  });

  it("shows the cart count with an accessible label", () => {
    renderAt(<SiteHeader menuOpen={false} onMenuOpenChange={() => {}} />);
    expect(screen.getByRole("button", {name: "Cart, 0 items"})).toBeInTheDocument();
  });
});

describe("MobileMenu", () => {
  it("lists every section plus WhatsApp, call and hours", async () => {
    renderAt(<MobileMenu open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", {hidden: true});
    for (const label of [
      "Shop",
      "Seminars",
      "Learn",
      "Customer stories",
      "Business opportunity",
      "Refer a friend",
      "About us",
      "FAQ",
      "Contact",
    ]) {
      expect(within(dialog).getByRole("link", {name: label})).toBeInTheDocument();
    }
    expect(within(dialog).getByRole("link", {name: "Chat on WhatsApp"})).toHaveAttribute("href", waHref);
    expect(within(dialog).getByRole("link", {name: `Call ${siteConfig.phone.display}`})).toHaveAttribute(
      "href",
      `tel:${siteConfig.phone.number}`
    );
    expect(within(dialog).getByText(/Mon–Sat/)).toBeInTheDocument();
  });

  it("focuses the close button on open and closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderAt(<MobileMenu open onClose={onClose} />);
    const close = screen.getByRole("button", {name: "Close menu"});
    await vi.waitFor(() => expect(close).toHaveFocus());
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes when a link is chosen", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderAt(<MobileMenu open onClose={onClose} />);
    await user.click(screen.getByRole("link", {name: "Seminars"}));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("SiteFooter", () => {
  it("states independence and the short disclaimer verbatim", () => {
    renderAt(<SiteFooter />);
    expect(
      screen.getByText(`${siteConfig.name} is an independent distributor of KEDI Healthcare products and is not the official KEDI company.`)
    ).toBeInTheDocument();
    const disclaimer = screen.getByText(/Food supplements are not medicines/);
    expect(disclaimer.textContent).toContain("Not intended to diagnose, treat, cure or prevent any disease.");
    expect(within(disclaimer).getByRole("link", {name: "Full disclaimer"})).toHaveAttribute("href", "/health-disclaimer");
  });

  it("lists legal links, catalog categories and contact actions", () => {
    renderAt(<SiteFooter />);
    for (const label of ["Privacy policy", "Terms of use", "Health disclaimer", "Delivery & returns"]) {
      expect(screen.getByRole("link", {name: label})).toBeInTheDocument();
    }
    expect(screen.getByRole("link", {name: "All products"})).toHaveAttribute("href", "/shop");
    expect(screen.getByRole("link", {name: "Fixture Digestion"})).toHaveAttribute("href", "/shop/digestion");
    expect(screen.getByRole("link", {name: siteConfig.phone.display})).toHaveAttribute("href", `tel:${siteConfig.phone.number}`);
    expect(screen.getByRole("link", {name: siteConfig.email})).toHaveAttribute("href", `mailto:${siteConfig.email}`);
    expect(screen.getByRole("button", {name: "Cookie settings"})).toBeInTheDocument();
  });
});

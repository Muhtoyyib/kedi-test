import {useState, type ReactNode} from "react";
import {cn} from "cn";
import {buttonVariants} from "@/components/ui/button";
import {ToastProvider} from "@/components/ui/toast";
import {AnnouncementBar} from "./announcement-bar";
import {CookieConsent} from "./cookie-consent";
import {FloatingWhatsApp} from "./floating-whatsapp";
import {SiteFooter} from "./footer";
import {MobileMenu} from "./mobile-menu";
import {SiteHeader} from "./site-header";

interface SiteLayoutProps {
  children: ReactNode;
  /** true = never render it (product page); "mobile" = render only ≥md. */
  hideFloatingWhatsApp?: boolean | "mobile";
  className?: string;
}

// The frame every public page renders inside (specs/site-shell/layout):
// skip link → announcement → sticky header → <main> → footer → floating
// WhatsApp → cookie bar. The cart drawer mounts here in change 05.
export function SiteLayout({children, hideFloatingWhatsApp, className}: SiteLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <ToastProvider>
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
          buttonVariants({variant: "primary", size: "sm"})
        )}
      >
        Skip to content
      </a>
      <CookieConsent />
      <AnnouncementBar />
      <SiteHeader menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="main" tabIndex={-1} className={className}>
        {children}
      </main>
      <SiteFooter />
      {hideFloatingWhatsApp !== true ? <FloatingWhatsApp hidden={menuOpen} mobileOnlyHidden={hideFloatingWhatsApp === "mobile"} /> : null}
      <div id="cart-drawer-mount" />
    </ToastProvider>
  );
}

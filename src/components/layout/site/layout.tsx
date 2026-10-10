import {lazy, Suspense, useState, type ReactNode} from "react";
import {cn} from "cn";
import {buttonVariants} from "@/components/ui/button";
import {ToastProvider} from "@/components/ui/toast";
import {CartDrawerMount} from "@/features/cart/cart-drawer-mount";
import {ReturnBanner} from "@/features/cart/return-banner";
import {AnnouncementBar} from "./announcement-bar";
import {CookieConsent} from "./cookie-consent";
import {FloatingWhatsApp} from "./floating-whatsapp";
import {SiteFooter} from "./footer";
import {SiteHeader} from "./site-header";

// The menu's dialog code only downloads on first open — keeps Base UI out of
// the initial bundle.
const LazyMobileMenu = lazy(() => import("./mobile-menu").then((m) => ({default: m.MobileMenu})));

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
  const [menuMounted, setMenuMounted] = useState(false);
  const onMenuOpenChange = (open: boolean) => {
    if (open) setMenuMounted(true);
    setMenuOpen(open);
  };
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
      <SiteHeader menuOpen={menuOpen} onMenuOpenChange={onMenuOpenChange} />
      <ReturnBanner />
      {menuMounted ? (
        <Suspense fallback={null}>
          <LazyMobileMenu open={menuOpen} onClose={() => onMenuOpenChange(false)} />
        </Suspense>
      ) : null}
      <main id="main" tabIndex={-1} className={className}>
        {children}
      </main>
      <SiteFooter />
      {hideFloatingWhatsApp !== true ? <FloatingWhatsApp hidden={menuOpen} mobileOnlyHidden={hideFloatingWhatsApp === "mobile"} /> : null}
      <div id="cart-drawer-mount">
        <CartDrawerMount />
      </div>
    </ToastProvider>
  );
}

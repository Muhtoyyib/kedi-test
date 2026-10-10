import {useLocation} from "@tanstack/react-router";
import {Menu} from "lucide-react";
import {track} from "@/lib/analytics/track";
import {markShellActivity} from "@/lib/shell-activity";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {WhatsAppIcon} from "@/components/ui/whatsapp-icon";
import {BrandLockup} from "./brand-lockup";
import {CartButton} from "./cart-button";
import {DesktopNav} from "./desktop-nav";

interface SiteHeaderProps {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

function chatLink() {
  return buildWhatsAppLink(generalChatMessage());
}

function onChatClick() {
  markShellActivity();
  track({event: "whatsapp_chat_click", location: "header"});
}

// Sticky 64px header (72px ≥lg): brand lockup, desktop nav, cart, WhatsApp
// and the mobile-menu trigger.
export function SiteHeader({menuOpen, onMenuOpenChange}: SiteHeaderProps) {
  const {pathname} = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 lg:h-18">
        <BrandLockup />
        <DesktopNav pathname={pathname} />
        <div className="flex items-center gap-1">
          <CartButton />
          <a
            href={chatLink()}
            aria-label="Chat with us on WhatsApp"
            onClick={onChatClick}
            className="flex size-11 items-center justify-center rounded-full bg-whatsapp text-whatsapp-ink transition-colors hover:bg-whatsapp-hover md:hidden"
          >
            <WhatsAppIcon size={20} />
          </a>
          <Button
            href={chatLink()}
            target="_blank"
            rel="noopener"
            variant="whatsapp"
            size="sm"
            onClick={onChatClick}
            className="max-md:hidden"
          >
            Chat on WhatsApp
          </Button>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => {
              markShellActivity();
              onMenuOpenChange(true);
            }}
            className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface lg:hidden"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

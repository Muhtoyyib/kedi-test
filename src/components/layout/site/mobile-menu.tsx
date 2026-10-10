import {useEffect, useRef} from "react";
import {useLocation} from "@tanstack/react-router";
import {Dialog} from "@base-ui/react/dialog";
import {ChevronRight, Clock, X} from "lucide-react";
import {cn} from "cn";
import {track} from "@/lib/analytics/track";
import {getSettings} from "@/lib/catalog/settings";
import {isNavActive, mobileNav} from "@/lib/site-nav";
import {siteConfig} from "@/lib/site-config";
import {markShellActivity} from "@/lib/shell-activity";
import {getSocialLinks} from "@/lib/socials";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {Button} from "@/components/ui/button";
import {SocialIcon} from "@/components/ui/social-icons";
import {BrandLockup} from "./brand-lockup";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

function MenuLinks({pathname, onNavigate}: {pathname: string; onNavigate: () => void}) {
  return (
    <nav aria-label="Mobile">
      <ul>
        {mobileNav.map((link) => {
          const active = isNavActive(link.href, pathname);
          return (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-14 items-center justify-between border-b border-line px-1 text-lg font-semibold",
                  active ? "text-brand-strong" : "text-ink"
                )}
              >
                {active ? (
                  <span aria-hidden="true" className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-full bg-sun" />
                ) : null}
                <span className={cn(active && "pl-3")}>{link.label}</span>
                <ChevronRight className="size-5 text-text-muted" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function MenuActions({hours = getSettings().openingHours}: {hours?: string}) {
  const openingHours = hours;
  return (
    <div className="space-y-3 p-4">
      <Button
        href={buildWhatsAppLink(generalChatMessage())}
        variant="whatsapp"
        size="lg"
        fullWidth
        onClick={() => {
          markShellActivity();
          track({event: "whatsapp_chat_click", location: "mobile_menu"});
        }}
      >
        Chat on WhatsApp
      </Button>
      <Button
        href={`tel:${siteConfig.phone.number}`}
        variant="secondary"
        fullWidth
        onClick={() => track({event: "phone_click", location: "mobile_menu"})}
      >
        Call {siteConfig.phone.display}
      </Button>
      {openingHours ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <Clock className="size-4" aria-hidden="true" />
          {openingHours}
        </p>
      ) : null}
      <div className="flex gap-1 pt-1">
        {getSocialLinks().map((s) => (
          <a
            key={s.network}
            href={s.href}
            target="_blank"
            rel="noopener"
            aria-label={s.label}
            onClick={() => track({event: "outbound_social", network: s.network})}
            className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
          >
            <SocialIcon network={s.network} />
          </a>
        ))}
      </div>
    </div>
  );
}

// Full-screen menu under 1024px (sections/03-mobile-menu). Dialog gives the
// focus trap, Esc close and scroll lock; focus lands on the close button
// and returns to the trigger.
export function MobileMenu({open, onClose}: MobileMenuProps) {
  const {pathname} = useLocation();
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <Dialog.Portal>
        <Dialog.Popup
          id="mobile-menu"
          initialFocus={closeRef}
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-canvas transition-transform duration-200",
            "translate-x-0 data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full",
            "motion-reduce:transition-none"
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <BrandLockup />
            <Dialog.Close
              ref={closeRef}
              aria-label="Close menu"
              className="flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
            >
              <X className="size-6" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <MenuLinks pathname={pathname} onNavigate={onClose} />
            <MenuActions />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

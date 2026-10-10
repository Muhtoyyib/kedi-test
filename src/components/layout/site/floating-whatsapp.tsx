import {useEffect, useState} from "react";
import {useLocation} from "@tanstack/react-router";
import {X} from "lucide-react";
import {cn} from "cn";
import {track} from "@/lib/analytics/track";
import {hasShellActivity, markShellActivity} from "@/lib/shell-activity";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {WhatsAppIcon} from "@/components/ui/whatsapp-icon";

const PROMPT_AFTER_MS = 20_000;

interface FloatingWhatsAppProps {
  hidden?: boolean;
  mobileOnlyHidden?: boolean;
}

function HelpBubble({href, onOpen, onClose}: {href: string; onOpen: () => void; onClose: () => void}) {
  return (
    <div className="flex max-w-56 items-start gap-1 rounded-card bg-canvas px-4 py-3 text-sm font-semibold text-ink shadow-card motion-safe:animate-fade-in">
      <a href={href} target="_blank" rel="noopener" onClick={onOpen}>
        Need help choosing? Chat with us
      </a>
      <button
        type="button"
        aria-label="Hide message"
        onClick={onClose}
        className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-text-muted hover:bg-surface"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

// Bottom-right WhatsApp entry (sections/05-floating-whatsapp). The help
// bubble appears once per session after 20s, never if the visitor already
// opened WhatsApp, the cart or the menu. The bottom offset rides above the
// cookie bar via its --cookie-bar-h custom property.
export function FloatingWhatsApp({hidden = false, mobileOnlyHidden = false}: FloatingWhatsAppProps) {
  const {pathname} = useLocation();
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hasShellActivity(window.sessionStorage)) return;
      markShellActivity();
      setBubble(true);
    }, PROMPT_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (hidden) return null;

  const href = buildWhatsAppLink(generalChatMessage());
  const onClick = () => {
    markShellActivity();
    setBubble(false);
    track({event: "whatsapp_chat_click", location: "floating", context: pathname});
  };

  return (
    <div
      className={cn(
        "fixed right-4 z-30 flex items-end gap-3 md:right-6",
        "bottom-[max(1rem,calc(env(safe-area-inset-bottom)+var(--cookie-bar-h,0px)))]",
        "md:bottom-[max(1.5rem,calc(env(safe-area-inset-bottom)+var(--cookie-bar-h,0px)))]",
        mobileOnlyHidden && "hidden md:flex"
      )}
    >
      {bubble ? <HelpBubble href={href} onOpen={onClick} onClose={() => setBubble(false)} /> : null}
      <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-label="Chat with us on WhatsApp"
        onClick={onClick}
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-whatsapp text-whatsapp-ink shadow-overlay transition-colors hover:bg-whatsapp-hover"
      >
        <WhatsAppIcon size={28} />
      </a>
    </div>
  );
}

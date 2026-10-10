import {useEffect, useRef, useSyncExternalStore, type RefObject} from "react";
import {clearAnalyticsCookies, getConsent, onConsentChange, setConsent} from "@/lib/consent";
import {Button} from "@/components/ui/button";

function ConsentBar({barRef, accept, decline}: {barRef: RefObject<HTMLDivElement | null>; accept: () => void; decline: () => void}) {
  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-cookie border-t border-line bg-canvas p-4 shadow-overlay md:right-auto md:bottom-4 md:left-4 md:w-105 md:rounded-panel md:border"
    >
      <p className="text-sm text-text-body">
        We use cookies to understand which pages help people and to measure our ads.{" "}
        <a href="/privacy" className="font-medium text-brand-strong underline underline-offset-4 hover:no-underline">
          Privacy policy
        </a>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Button variant="primary" size="sm" onClick={accept}>
          Accept
        </Button>
        <Button variant="secondary" size="sm" onClick={decline}>
          Decline
        </Button>
      </div>
    </div>
  );
}

// NDPA consent bar (sections/06-cookie-consent). Server snapshot = decided,
// so returning visitors never see it flash; nothing is tracked until Accept.
// It publishes its height as --cookie-bar-h so the floating WhatsApp button
// can sit above it.
export function CookieConsent() {
  const choice = useSyncExternalStore(
    onConsentChange,
    () => getConsent(window.localStorage, Date.now()),
    () => true
  );
  const visible = choice === null;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.documentElement;
    if (!visible) {
      el.style.removeProperty("--cookie-bar-h");
      return;
    }
    const apply = () => el.style.setProperty("--cookie-bar-h", `${ref.current?.offsetHeight ?? 0}px`);
    apply();
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("resize", apply);
      el.style.removeProperty("--cookie-bar-h");
    };
  }, [visible]);

  if (!visible) return null;

  const accept = () => setConsent(window.localStorage, true, Date.now());
  const decline = () => {
    const wasAccepted = getConsent(window.localStorage, Date.now()) === true;
    setConsent(window.localStorage, false, Date.now());
    if (wasAccepted) {
      clearAnalyticsCookies(document);
      window.location.reload();
    }
  };

  return <ConsentBar barRef={ref} accept={accept} decline={decline} />;
}

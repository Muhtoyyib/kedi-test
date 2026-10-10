import {useEffect} from "react";
import {useLocation} from "@tanstack/react-router";
import {captureAttribution} from "@/lib/attribution";
import {loadAnalytics, sendPageView, type AnalyticsIds} from "@/lib/analytics/loaders";
import {dropAnalyticsBuffer} from "@/lib/analytics/track";
import {getConsent, onConsentChange} from "@/lib/consent";

const ids: AnalyticsIds = {
  ga4: import.meta.env.VITE_GA4_ID || undefined,
  meta: import.meta.env.VITE_META_PIXEL_ID || undefined,
  clarity: import.meta.env.VITE_CLARITY_ID || undefined,
};

// Mounted once in __root: loads the tags when consent is granted (or drops
// the buffer on decline), captures UTM attribution on landing, and fires a
// manual page_view on every client-side route change.
export function AnalyticsBridge() {
  const {pathname} = useLocation();

  useEffect(() => {
    const apply = () => {
      const consent = getConsent(window.localStorage, Date.now());
      if (consent === true) loadAnalytics(ids);
      if (consent === false) dropAnalyticsBuffer();
    };
    apply();
    return onConsentChange(apply);
  }, []);

  useEffect(() => {
    captureAttribution(window.location.href, window.sessionStorage, Date.now());
  }, []);

  useEffect(() => {
    sendPageView(pathname, document.title);
  }, [pathname]);

  return null;
}

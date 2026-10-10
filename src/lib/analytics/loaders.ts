// Third-party tag injection (change 07 design). Runs once, after consent,
// deferred to idle. GA4 send_page_view is off — the SPA router fires
// page_view manually on every route change via sendPageView.

import {markAnalyticsReady} from "./track";

export type TagParam =
  | string
  | number
  | boolean
  | Date
  | string[]
  | Record<string, string | number | boolean | string[] | undefined>
  | undefined;
export type Gtag = (...args: TagParam[]) => void;
export type Fbq = (command: string, name: string, params?: Record<string, string | number | boolean | string[]>) => void;

export interface AnalyticsIds {
  ga4?: string;
  meta?: string;
  clarity?: string;
}

let loaded = false;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    clarity?: ClarityStub;
    dataLayer?: TagParam[][];
  }
}

type ClarityStub = ((...args: string[]) => void) & {q?: string[][]};

export function loadAnalytics(ids: AnalyticsIds): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  onIdle(() => {
    if (ids.ga4) injectGa4(ids.ga4);
    if (ids.meta) injectMeta(ids.meta);
    if (ids.clarity) injectClarity(ids.clarity);
    markAnalyticsReady();
  });
}

export function analyticsLoaded(): boolean {
  return loaded;
}

/** Manual SPA page view (GA4 + Meta) — called on every route change. */
export function sendPageView(path: string, title: string): void {
  if (!loaded) return;
  window.gtag?.("event", "page_view", {page_location: window.location.origin + path, page_title: title});
  window.fbq?.("track", "PageView");
}

function onIdle(fn: () => void): void {
  const ric = (window as {requestIdleCallback?: (cb: () => void, opts?: {timeout: number}) => number}).requestIdleCallback;
  if (ric) ric(fn, {timeout: 2000});
  else window.setTimeout(fn, 1500);
}

function injectGa4(id: string): void {
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(s);
  const dataLayer = (window.dataLayer = window.dataLayer ?? []);
  const gtag: Gtag = (...args) => {
    dataLayer.push(args);
  };
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", id, {send_page_view: false});
}

function injectMeta(id: string): void {
  const fbq: Fbq & {queue?: TagParam[][]; loaded?: boolean; version?: string} = (command, name, params) => {
    fbq.queue = fbq.queue ?? [];
    fbq.queue.push([command, name, params]);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.append(s);
  fbq("init", id);
}

function injectClarity(id: string): void {
  const stub: ClarityStub =
    window.clarity ??
    ((...args: string[]) => {
      stub.q = stub.q ?? [];
      stub.q.push(args);
    });
  window.clarity = stub;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.append(s);
}

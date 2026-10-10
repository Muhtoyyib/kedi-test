// The one funnel all tracking goes through (docs/analytics-events.md).
// Events before consent is granted are buffered (cap 20) and flushed once
// loaders.ts injects the tags; a decline drops them. No-op during SSR.

import {toMetaEvent, type AnalyticsEvent} from "./events";
import type {Fbq, Gtag} from "./loaders";

const BUFFER_MAX = 20;

let buffer: AnalyticsEvent[] = [];
let ready = false;

export function track(e: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (!ready) {
    buffer.push(e);
    if (buffer.length > BUFFER_MAX) buffer.shift();
    return;
  }
  forward(e);
}

/** Called by loaders.ts once the tags are live — flushes the buffer. */
export function markAnalyticsReady(): void {
  ready = true;
  for (const e of buffer) forward(e);
  buffer = [];
}

/** Called when consent is declined — pre-consent events are never sent. */
export function dropAnalyticsBuffer(): void {
  buffer = [];
}

/** Test hook. */
export function resetAnalytics(): void {
  ready = false;
  buffer = [];
}

function forward(e: AnalyticsEvent): void {
  const {event, ...params} = e;
  const gtag: Gtag | undefined = window.gtag;
  gtag?.("event", event, params);
  const meta = toMetaEvent(e);
  const fbq: Fbq | undefined = window.fbq;
  if (meta && fbq) fbq("track", meta.name, meta.params ?? {});
}

// Order logging: fire-and-forget to the Apps Script intake endpoint.
// sendBeacon survives the same-tab navigation to WhatsApp; fetch keepalive
// is the fallback. "unavailable" only warns in dev — WhatsApp still opens.

import type {OrderPayload} from "./payload";

export type SendStatus = "queued" | "unavailable";

const endpoint = (): string => (import.meta.env?.VITE_APPS_SCRIPT_URL as string | undefined) ?? "";

export function sendOrder(payload: OrderPayload, honeypot: string, url: string = endpoint()): SendStatus {
  if (!url) return warn("no VITE_APPS_SCRIPT_URL configured");
  const body = JSON.stringify({type: "order", hp: honeypot, payload});
  try {
    if (navigator.sendBeacon(url, new Blob([body], {type: "text/plain;charset=utf-8"}))) return "queued";
  } catch {
    // fall through to fetch
  }
  try {
    void fetch(url, {method: "POST", body, headers: {"Content-Type": "text/plain;charset=utf-8"}, keepalive: true});
    return "queued";
  } catch {
    return warn("order beacon and fetch both failed");
  }
}

function warn(reason: string): SendStatus {
  if (import.meta.env?.DEV) console.warn(`[order] not logged to the Sheet: ${reason}`);
  return "unavailable";
}

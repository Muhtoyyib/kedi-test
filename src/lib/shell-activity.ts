// Session flag for the floating-WhatsApp help bubble: it may prompt once
// per browsing session, and never at all if the visitor has already opened
// WhatsApp, the cart or the mobile menu.

import type {StorageLike} from "./announcement";

export const SHELL_ACTIVITY_KEY = "wa-bubble-seen";

export function hasShellActivity(storage: StorageLike): boolean {
  return storage.getItem(SHELL_ACTIVITY_KEY) !== null;
}

export function markShellActivity(storage?: StorageLike): void {
  try {
    (storage ?? window.sessionStorage).setItem(SHELL_ACTIVITY_KEY, "1");
  } catch {
    // storage unavailable (private mode) → the bubble just stays quiet
  }
}

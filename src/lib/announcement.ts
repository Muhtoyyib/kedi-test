// Announcement-bar dismissal memory (sections/01-announcement-bar). A
// dismissal is keyed on the message text, so a new Sheet announcement shows
// again even to visitors who dismissed the old one.

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const ANNOUNCEMENT_KEY = "announcement-dismissed";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const EVENT = "kedi:announcement-dismissed";

// Small non-cryptographic hash — only used to compare message versions.
export function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (h * 33) ^ text.charCodeAt(i);
  return (h >>> 0).toString(36);
}

interface Dismissal {
  hash: string;
  at: number;
}

function read(storage: StorageLike): Dismissal | null {
  try {
    const raw = JSON.parse(storage.getItem(ANNOUNCEMENT_KEY) ?? "null") as Dismissal | null;
    if (raw && typeof raw.hash === "string" && typeof raw.at === "number") return raw;
  } catch {
    // corrupt value → treat as never dismissed
  }
  return null;
}

export function isDismissed(storage: StorageLike, text: string, now: number): boolean {
  const d = read(storage);
  return d !== null && d.hash === hashText(text) && now - d.at < TTL_MS;
}

export function dismiss(storage: StorageLike, text: string, now: number): void {
  storage.setItem(ANNOUNCEMENT_KEY, JSON.stringify({hash: hashText(text), at: now} satisfies Dismissal));
  window.dispatchEvent(new Event(EVENT));
}

/** Subscribe to dismissal writes so useSyncExternalStore can re-read. */
export function onDismissedChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

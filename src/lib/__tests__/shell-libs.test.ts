import {describe, expect, it, vi} from "vite-plus/test";
import {renderHook} from "@testing-library/react";
import {dismiss, hashText, isDismissed, type StorageLike} from "@/lib/announcement";
import {clearAnalyticsCookies, getConsent, onConsentChange, setConsent, clearConsent} from "@/lib/consent";
import {hasShellActivity, markShellActivity} from "@/lib/shell-activity";
import {useHydrated} from "@/lib/use-hydrated";
import {buildWhatsAppLink} from "@/lib/whatsapp/link";
import {generalChatMessage} from "@/lib/whatsapp/messages";
import {siteConfig} from "@/lib/site-config";

function memoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_700_000_000_000;

describe("announcement", () => {
  it("hashText is deterministic and message-sensitive", () => {
    expect(hashText("hello")).toBe(hashText("hello"));
    expect(hashText("hello")).not.toBe(hashText("hello!"));
  });

  it("dismissed stays hidden for 7 days, then reappears", () => {
    const s = memoryStorage();
    dismiss(s, "msg", NOW);
    expect(isDismissed(s, "msg", NOW + 6 * DAY)).toBe(true);
    expect(isDismissed(s, "msg", NOW + 8 * DAY)).toBe(false);
  });

  it("a changed message shows again after dismissal", () => {
    const s = memoryStorage();
    dismiss(s, "old message", NOW);
    expect(isDismissed(s, "new message", NOW + 1)).toBe(false);
  });
});

describe("consent", () => {
  it("returns null before a choice and the stored value after", () => {
    const s = memoryStorage();
    expect(getConsent(s, NOW)).toBeNull();
    setConsent(s, true, NOW);
    expect(getConsent(s, NOW)).toBe(true);
    setConsent(s, false, NOW);
    expect(getConsent(s, NOW)).toBe(false);
  });

  it("expires after 182 days", () => {
    const s = memoryStorage();
    setConsent(s, true, NOW);
    expect(getConsent(s, NOW + 181 * DAY)).toBe(true);
    expect(getConsent(s, NOW + 183 * DAY)).toBeNull();
  });

  it("treats corrupt storage as no choice", () => {
    const s = memoryStorage();
    s.setItem("cookie-consent", "not json{");
    expect(getConsent(s, NOW)).toBeNull();
    s.setItem("cookie-consent", JSON.stringify({analytics: "yes", at: NOW}));
    expect(getConsent(s, NOW)).toBeNull();
  });

  it("notifies subscribers on change and clear", () => {
    const cb = vi.fn();
    const off = onConsentChange(cb);
    setConsent(window.localStorage, true, NOW);
    clearConsent(window.localStorage);
    off();
    setConsent(window.localStorage, false, NOW);
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("clears analytics cookies and leaves others", () => {
    document.cookie = "_ga=GA1.1.1; path=/";
    document.cookie = "session_id=keep; path=/";
    clearAnalyticsCookies(document);
    expect(document.cookie).not.toContain("_ga");
    expect(document.cookie).toContain("session_id");
  });
});

describe("whatsapp", () => {
  it("builds a wa.me link with the message encoded", () => {
    const url = new URL(buildWhatsAppLink("Hello there"));
    expect(url.origin + url.pathname).toBe(`https://wa.me/${siteConfig.whatsapp.number}`);
    expect(url.searchParams.get("text")).toBe("Hello there");
  });

  it("general chat message greets by brand name", () => {
    expect(generalChatMessage()).toContain(`Hello ${siteConfig.name}!`);
  });
});

describe("shell-activity", () => {
  it("tracks the once-per-session flag", () => {
    const s = memoryStorage();
    expect(hasShellActivity(s)).toBe(false);
    markShellActivity(s);
    expect(hasShellActivity(s)).toBe(true);
  });
});

describe("useHydrated", () => {
  it("is true on the client", () => {
    const {result} = renderHook(() => useHydrated());
    expect(result.current).toBe(true);
  });
});

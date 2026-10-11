import fc from "fast-check";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {createReferralCode, isValidReferralCode, normalizeReferralCode, REFERRAL_CODE_RE} from "../referral/code.ts";
import {captureReferralFromUrl, getStoredReferralCode, REFERRAL_KEY, REFERRAL_MAX_AGE_MS} from "../referral/capture.ts";
import {buildReferralLink, referralShareMessage} from "../referral/link.ts";
import {registerReferralCode} from "../referral/register.ts";
import {track} from "@/lib/analytics/track";

vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));

const memStorage = () => {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    map,
  };
};

const loc = (search: string) => ({search, pathname: "/", hash: ""});

beforeEach(() => vi.clearAllMocks());

describe("createReferralCode", () => {
  it("uses the first name in caps plus the last 4 phone digits", () => {
    expect(createReferralCode("Amaka", "0803 123 4821")).toBe("AMAKA-4821");
    expect(createReferralCode("Chukwuemeka", "+234 909 000 1234")).toBe("CHUKWUEMEKA-1234");
  });

  it("strips accents and non-letters, caps at 12", () => {
    expect(createReferralCode("Ọlá", "09090001234")).toBe("OLA-1234");
    expect(createReferralCode("María-José", "09090001234")).toBe("MARIAJOSE-1234");
    expect(createReferralCode("Alexanderthegreat", "09090001234")).toBe("ALEXANDERTHE-1234");
  });

  it("falls back to FRIEND when fewer than 2 Latin letters remain", () => {
    expect(createReferralCode("李", "09090001234")).toBe("FRIEND-1234");
    expect(createReferralCode("A", "09090001234")).toBe("FRIEND-1234");
    expect(createReferralCode("", "09090001234")).toBe("FRIEND-1234");
  });

  it("property: every output matches the code pattern", () => {
    fc.assert(
      fc.property(fc.string({maxLength: 30}), fc.string(), (name, phone) => {
        // last4 may be short when the phone has < 4 digits — normalise the input
        const padded = `${phone}1234`;
        expect(createReferralCode(name, padded)).toMatch(REFERRAL_CODE_RE);
      })
    );
  });
});

describe("normalize/isValidReferralCode", () => {
  it("accepts lowercase input and the optional trailing letter", () => {
    expect(normalizeReferralCode("  amaka-4821 ")).toBe("AMAKA-4821");
    expect(isValidReferralCode("amaka-4821")).toBe(true);
    expect(isValidReferralCode("AMAKA-4821B")).toBe(true);
  });

  it("rejects malformed values", () => {
    for (const bad of ["", "A-1234", "TOOLONGNAMEHERE-1234", "AMAKA-482", "AMAKA_4821", "<script>", "AMAKA-4821!"]) {
      expect(isValidReferralCode(bad)).toBe(false);
    }
  });
});

describe("captureReferralFromUrl", () => {
  it("stores a valid code, strips ref, and keeps other params", () => {
    const storage = memStorage();
    const history = {replaceState: vi.fn()};
    const code = captureReferralFromUrl({location: loc("?ref=amaka-4821&utm_source=ig"), storage, history, now: 1000});
    expect(code).toBe("AMAKA-4821");
    expect(history.replaceState).toHaveBeenCalledWith(null, "", "/?utm_source=ig");
    expect(storage.map.get(REFERRAL_KEY)).toBe(JSON.stringify({code: "AMAKA-4821", at: 1000}));
    expect(track).toHaveBeenCalledWith({event: "referral_landing"});
  });

  it("ignores invalid codes and does not store", () => {
    const storage = memStorage();
    const history = {replaceState: vi.fn()};
    expect(captureReferralFromUrl({location: loc("?ref=<script>"), storage, history})).toBeNull();
    expect(storage.map.has(REFERRAL_KEY)).toBe(false);
    expect(track).not.toHaveBeenCalled();
    expect(history.replaceState).toHaveBeenCalledWith(null, "", "/");
  });

  it("does nothing when ref is absent", () => {
    const history = {replaceState: vi.fn()};
    expect(captureReferralFromUrl({location: loc("?utm_source=x"), storage: memStorage(), history})).toBeNull();
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it("a newer link overrides an older stored code", () => {
    const storage = memStorage();
    captureReferralFromUrl({location: loc("?ref=AMAKA-4821"), storage, now: 1000});
    captureReferralFromUrl({location: loc("?ref=NKECHI-9000"), storage, now: 2000});
    expect(getStoredReferralCode(storage, 2000)).toBe("NKECHI-9000");
  });
});

describe("getStoredReferralCode", () => {
  it("returns the code within 30 days, clears it after", () => {
    const storage = memStorage();
    storage.setItem?.(REFERRAL_KEY, JSON.stringify({code: "AMAKA-4821", at: 0}));
    expect(getStoredReferralCode(storage, REFERRAL_MAX_AGE_MS - 1)).toBe("AMAKA-4821");
    expect(getStoredReferralCode(storage, REFERRAL_MAX_AGE_MS + 1)).toBeNull();
    expect(storage.map.has(REFERRAL_KEY)).toBe(false);
  });
});

describe("registerReferralCode", () => {
  it("posts the referral_code body and retries once on failure", async () => {
    const post = vi.fn().mockRejectedValueOnce(new Error("net")).mockResolvedValue(undefined);
    vi.useFakeTimers();
    registerReferralCode({firstName: "Amaka", phone: "+2348031234821", code: "AMAKA-4821"}, {url: "https://x", post, retryMs: 10});
    await Promise.resolve();
    expect(post).toHaveBeenCalledTimes(1);
    const [url, body] = post.mock.calls[0];
    expect(url).toBe("https://x");
    expect(JSON.parse(body)).toEqual({type: "referral_code", payload: {firstName: "Amaka", phone: "+2348031234821", code: "AMAKA-4821"}});
    await vi.advanceTimersByTimeAsync(10);
    expect(post).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});

describe("referral link + share message", () => {
  it("buildReferralLink points at the site root with ref", () => {
    expect(buildReferralLink("AMAKA-4821")).toMatch(/\?ref=AMAKA-4821$/);
  });

  it("share message includes the reward text and the link (docs §8)", () => {
    const msg = referralShareMessage("AMAKA-4821", "a ₦500 discount");
    expect(msg).toContain("They explain everything and follow up properly");
    expect(msg).toContain("a ₦500 discount");
    expect(msg).toContain("?ref=AMAKA-4821");
  });
});

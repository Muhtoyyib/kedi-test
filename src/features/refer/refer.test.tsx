import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {fireEvent, render, screen} from "@testing-library/react";

vi.mock("@/lib/analytics/track", () => ({track: vi.fn()}));

import {track} from "@/lib/analytics/track";
import {getSettings} from "@/lib/catalog/settings";
import {MY_REFERRAL_KEY} from "@/lib/referral/mine";
import {ToastProvider} from "@/components/ui/toast";
import {GetYourCode} from "./components/get-your-code";
import {HeroReward} from "./components/hero-reward";
import {ReferHowItWorks} from "./components/refer-how-it-works";
import {ReferralTerms} from "./components/referral-terms";
import {SharePanel} from "./components/share-panel";

const settings = getSettings();
const register = vi.fn();

function renderIsland() {
  return render(
    <ToastProvider>
      <GetYourCode register={register} />
    </ToastProvider>
  );
}

function submitCode() {
  fireEvent.change(screen.getByLabelText(/First name/), {target: {value: "Amaka"}});
  fireEvent.change(screen.getByLabelText(/WhatsApp number/), {target: {value: "08031234821"}});
  fireEvent.click(screen.getByLabelText(/I agree that/));
  fireEvent.click(screen.getByRole("button", {name: "Get my link"}));
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.history.replaceState(null, "", "/refer");
});

describe("HeroReward", () => {
  it("shows both rewards from settings", () => {
    render(<HeroReward />);
    expect(screen.getByRole("heading", {level: 1, name: "Share the care. You both get rewarded."})).toBeInTheDocument();
    expect(screen.getByText(settings.referralFriendRewardText)).toBeInTheDocument();
    expect(screen.getByText(settings.referralRewardText)).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "Get your link"})).toHaveAttribute("href", "#get-your-code");
  });
});

describe("ReferHowItWorks", () => {
  it("shows the three steps in order", () => {
    render(<ReferHowItWorks />);
    const items = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(items).toHaveLength(3);
    expect(items[0]).toContain("Get your link.");
    expect(items[1]).toContain("Share it.");
    expect(items[2]).toContain("You both get rewarded.");
  });
});

describe("GetYourCode", () => {
  it("validates name, phone and consent before generating", () => {
    renderIsland();
    fireEvent.click(screen.getByRole("button", {name: "Get my link"}));
    expect(screen.getByText("Enter your first name (letters only)")).toBeInTheDocument();
    expect(screen.getByText("Enter a Nigerian mobile number, e.g. 0803 123 4567")).toBeInTheDocument();
    expect(screen.getByText("Please tick to agree so we can send your link")).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it("shows the code instantly and registers in the background", () => {
    renderIsland();
    submitCode();
    expect(screen.getByText("AMAKA-4821")).toBeInTheDocument();
    expect(register).toHaveBeenCalledWith(
      {firstName: "Amaka", phone: "+2348031234821", code: "AMAKA-4821"},
      expect.objectContaining({onGiveUp: expect.any(Function)})
    );
    expect(track).toHaveBeenCalledWith({event: "referral_code_created"});
    expect(track).toHaveBeenCalledWith({event: "form_submit", form_id: "referral_code"});
    // Only firstName + code on the device — never the phone number.
    expect(window.localStorage.getItem(MY_REFERRAL_KEY)).toBe(JSON.stringify({firstName: "Amaka", code: "AMAKA-4821"}));
  });

  it("shows the still-works note when registration gives up", () => {
    register.mockImplementation((_input, deps) => deps.onGiveUp?.());
    renderIsland();
    submitCode();
    expect(screen.getByText("AMAKA-4821")).toBeInTheDocument();
    expect(screen.getByText(/It still works/)).toBeInTheDocument();
  });

  it("restores a stored code and Start again clears it", () => {
    window.localStorage.setItem(MY_REFERRAL_KEY, JSON.stringify({firstName: "Amaka", code: "AMAKA-4821"}));
    renderIsland();
    expect(screen.getByText("AMAKA-4821")).toBeInTheDocument();
    expect(screen.queryByLabelText(/First name/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Not you? Start again"}));
    expect(screen.getByLabelText(/First name/)).toBeInTheDocument();
    expect(window.localStorage.getItem(MY_REFERRAL_KEY)).toBeNull();
  });
});

describe("SharePanel", () => {
  const props = {code: "AMAKA-4821", link: "https://example.com/?ref=AMAKA-4821", friendReward: "₦1,000 off"};

  function renderPanel() {
    return render(
      <ToastProvider>
        <SharePanel {...props} />
      </ToastProvider>
    );
  }

  it("opens WhatsApp with the message (no fixed number) containing the link", () => {
    renderPanel();
    const share = screen.getByRole("link", {name: "Share on WhatsApp"});
    expect(share).toHaveAttribute("href", expect.stringMatching(/^https:\/\/wa\.me\/\?text=/));
    expect(decodeURIComponent(share.getAttribute("href")!)).toContain("/?ref=AMAKA-4821");
    expect(decodeURIComponent(share.getAttribute("href")!)).toContain("₦1,000 off");
  });

  it("copies the link with a toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {value: {writeText}, configurable: true});
    renderPanel();
    fireEvent.click(screen.getByRole("button", {name: "Copy link"}));
    await screen.findByText("Link copied");
    expect(writeText).toHaveBeenCalledWith(props.link);
    expect(track).toHaveBeenCalledWith({event: "referral_link_shared", method: "copy"});
  });

  it("copies the code with a toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {value: {writeText}, configurable: true});
    renderPanel();
    fireEvent.click(screen.getByRole("button", {name: "Copy code"}));
    await screen.findByText("Code copied");
    expect(writeText).toHaveBeenCalledWith("AMAKA-4821");
  });

  it("hides native share when unsupported, shows it when supported", () => {
    renderPanel();
    expect(screen.queryByRole("button", {name: "More ways to share"})).not.toBeInTheDocument();
  });
});

describe("ReferralTerms", () => {
  it("lists all terms and the loyalty note when set", () => {
    render(<ReferralTerms />);
    for (const fragment of [/first.*order is paid/, /can't refer yourself/, /can't be exchanged for cash/, /programme at any time/]) {
      expect(screen.getByText(fragment)).toBeInTheDocument();
    }
    expect(screen.getByText("Loyalty reward")).toBeInTheDocument();
    expect(screen.getByText(settings.loyaltyText!)).toBeInTheDocument();
  });
});

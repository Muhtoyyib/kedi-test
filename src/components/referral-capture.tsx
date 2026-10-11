// Runs once after hydration: captures a valid ?ref= code into localStorage,
// strips it from the address bar, and tracks referral_landing.

import {useEffect} from "react";
import {captureReferralFromUrl} from "@/lib/referral/capture";

export function ReferralCapture() {
  useEffect(() => {
    captureReferralFromUrl({location: window.location, storage: window.localStorage, history: window.history});
  }, []);
  return null;
}

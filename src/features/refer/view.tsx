import {GetYourCode} from "./components/get-your-code";
import {HeroReward} from "./components/hero-reward";
import {ReferHowItWorks} from "./components/refer-how-it-works";
import {ReferralTerms} from "./components/referral-terms";

// /refer — reward, how it works, the code island (form + share panel), terms.
export function ReferView() {
  return (
    <>
      <HeroReward />
      <ReferHowItWorks />
      <GetYourCode />
      <ReferralTerms />
    </>
  );
}

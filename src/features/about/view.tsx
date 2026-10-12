import {AboutCta} from "./components/about-cta";
import {AboutLocation} from "./components/about-location";
import {AboutStory} from "./components/about-story";
import {IndependentStatement} from "./components/independent-statement";
import {MissionValues} from "./components/mission-values";

// /about — the distributor's story, mission and values, the independence
// statement, location/service areas and a closing CTA (about/page spec).
export function AboutView() {
  return (
    <>
      <AboutStory />
      <MissionValues />
      <IndependentStatement />
      <AboutLocation />
      <AboutCta />
    </>
  );
}

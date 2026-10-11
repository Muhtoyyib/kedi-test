import {catalog} from "@/lib/catalog/data";
import {getHighlights} from "@/lib/catalog/highlights";
import {getNextSeminar, getSeminars} from "@/lib/catalog/seminars";
import {getSettings} from "@/lib/catalog/settings";
import {getFaqs} from "@/lib/content/faq";
import {useHydrated} from "@/lib/use-hydrated";
import {Host} from "./components/host";
import {PastHighlights} from "./components/past-highlights";
import {Registration} from "./components/registration";
import {SeminarFaq} from "./components/seminar-faq";
import {SeminarHero} from "./components/seminar-hero";
import {UpcomingAndCalendar} from "./components/upcoming";
import {WhatYoullLearn} from "./components/what-youll-learn";

// /seminars — hero → register → learn points → host → upcoming+calendar →
// highlights → seminar FAQs. `now` is re-evaluated after hydration so a
// prerendered page never keeps advertising a seminar that already started.
export function SeminarsView() {
  const hydrated = useHydrated();
  const now = hydrated ? new Date() : new Date(catalog.generatedAt);
  const next = getNextSeminar(now);
  const upcoming = getSeminars()
    .filter((s) => s.status === "scheduled" && new Date(s.startsAt) > now && s.id !== next?.id)
    .slice(0, 4);
  const highlights = getHighlights(3);
  const faqs = getFaqs({page: "seminars"});
  const offerText = getSettings().seminarOfferText;

  return (
    <>
      <SeminarHero seminar={next} now={now} hydrated={hydrated} />
      <Registration seminar={next} />
      <WhatYoullLearn seminar={next} offerText={offerText} />
      <Host />
      <UpcomingAndCalendar upcoming={upcoming} now={now} />
      <PastHighlights highlights={highlights} />
      <SeminarFaq faqs={faqs} />
    </>
  );
}

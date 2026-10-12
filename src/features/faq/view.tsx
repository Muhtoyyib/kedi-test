import {faqGroups} from "../../../content/faq.ts";
import {getSettings} from "@/lib/catalog/settings";
import {getFaqs} from "@/lib/content/faq";
import {FaqGroups} from "./components/faq-groups";
import {FaqHeader} from "./components/faq-header";
import {StillHaveQuestions} from "./components/still-have-questions";

// /faq — header with jump links, grouped accordions, closing contact band.
export function FaqView() {
  const items = getFaqs({page: "faq"});
  const present = faqGroups.filter((g) => items.some((i) => i.group === g.id)).map((g) => g.id);
  return (
    <>
      <FaqHeader groups={present} />
      <FaqGroups items={items} />
      <StillHaveQuestions openingHours={getSettings().openingHours} />
    </>
  );
}

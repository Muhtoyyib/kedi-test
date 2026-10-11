import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {buildMeta} from "@/lib/seo/meta";
import {faqPageLd, jsonLdScripts, seminarEventLd} from "@/lib/seo/jsonld";
import {siteConfig} from "@/lib/site-config";
import {SeminarsView} from "@/features/seminars/view";

// Catalog/content helpers are dynamic-imported so the generated catalog
// stays in lazy chunks (route options are bundled eagerly — see shop.index).
async function seminarsHead() {
  const [{getSeminars}, {getFaqs}] = await Promise.all([import("@/lib/catalog/seminars"), import("@/lib/content/faq")]);
  const now = new Date();
  const upcoming = getSeminars().filter((s) => s.status === "scheduled" && new Date(s.startsAt) > now);
  const faqLd = faqPageLd(getFaqs({page: "seminars"}));
  const meta = buildMeta({
    title: `Free weekly wellness seminars | ${siteConfig.name}`,
    description: `Join our free weekly wellness seminar in ${siteConfig.city} or online. Learn practical health habits, ask questions and meet the team. Register in one minute.`,
    path: "/seminars",
  });
  return {...meta, scripts: jsonLdScripts([...upcoming.map(seminarEventLd), ...(faqLd ? [faqLd] : [])])};
}

export const Route = createFileRoute("/seminars")({
  head: () => seminarsHead(),
  component: SeminarsPage,
});

function SeminarsPage() {
  return (
    <SiteLayout>
      <SeminarsView />
    </SiteLayout>
  );
}

import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {BusinessView} from "@/features/business/view";
import {buildMeta} from "@/lib/seo/meta";
import {faqPageLd, jsonLdScripts} from "@/lib/seo/jsonld";
import {getPageTitle, siteConfig} from "@/lib/site-config";

export const Route = createFileRoute("/business-opportunity")({
  head: async () => {
    const {getFaqs} = await import("@/lib/content/faq");
    const meta = buildMeta({
      title: getPageTitle("Become a KEDI distributor"),
      description: `Learn how KEDI's independent distributor programme works and the training and support we give new distributors in ${siteConfig.city}. No income promises: just honest information.`,
      path: "/business-opportunity",
    });
    const faqLd = faqPageLd(getFaqs({page: "business"}));
    return {...meta, scripts: jsonLdScripts(faqLd ? [faqLd] : [])};
  },
  component: () => (
    <SiteLayout>
      <BusinessView />
    </SiteLayout>
  ),
});

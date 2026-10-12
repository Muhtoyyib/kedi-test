import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {FaqView} from "@/features/faq/view";
import {buildMeta} from "@/lib/seo/meta";
import {faqPageLd, jsonLdScripts} from "@/lib/seo/jsonld";
import {getPageTitle, siteConfig} from "@/lib/site-config";

export const Route = createFileRoute("/faq")({
  head: async () => {
    const {getFaqs} = await import("@/lib/content/faq");
    const meta = buildMeta({
      title: getPageTitle("Frequently asked questions"),
      description: `How to order KEDI products on WhatsApp, payment, delivery in ${siteConfig.city}, returns, seminars and more.`,
      path: "/faq",
    });
    const faqLd = faqPageLd(getFaqs({page: "faq"}));
    return {...meta, scripts: jsonLdScripts(faqLd ? [faqLd] : [])};
  },
  component: () => (
    <SiteLayout>
      <FaqView />
    </SiteLayout>
  ),
});

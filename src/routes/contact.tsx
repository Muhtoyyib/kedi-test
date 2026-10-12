import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {ContactView} from "@/features/contact/view";
import {buildMeta} from "@/lib/seo/meta";
import {contactPageLd, jsonLdScripts} from "@/lib/seo/jsonld";
import {getPageTitle, siteConfig} from "@/lib/site-config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...buildMeta({
      title: getPageTitle("Contact us"),
      description: `Chat with ${siteConfig.name} on WhatsApp, call ${siteConfig.phone.display}, or visit us in ${siteConfig.city}. Opening hours, directions and how to pay safely.`,
      path: "/contact",
    }),
    scripts: jsonLdScripts([contactPageLd()]),
  }),
  component: () => (
    <SiteLayout>
      <ContactView />
    </SiteLayout>
  ),
});

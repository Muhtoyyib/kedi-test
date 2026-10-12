import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {AboutView} from "@/features/about/view";
import {getAbout} from "@/lib/content/about";
import {buildMeta} from "@/lib/seo/meta";
import {jsonLdScripts, localBusinessLd, personLd} from "@/lib/seo/jsonld";
import {getPageTitle, siteConfig} from "@/lib/site-config";

export const Route = createFileRoute("/about")({
  head: () => {
    const {distributor} = getAbout();
    const years = distributor.yearsOfExperience ? ` with ${distributor.yearsOfExperience} years' experience` : "";
    const meta = buildMeta({
      title: getPageTitle("About us"),
      description: `Meet ${distributor.name}, an independent KEDI distributor in ${siteConfig.city}${years}, and learn how we help customers choose and use KEDI products.`,
      path: "/about",
    });
    // Page-level LocalBusiness with the distributor as founder (about design).
    return {...meta, scripts: jsonLdScripts([localBusinessLd(personLd())])};
  },
  component: () => (
    <SiteLayout>
      <AboutView />
    </SiteLayout>
  ),
});

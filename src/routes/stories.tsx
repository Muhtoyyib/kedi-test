import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {StoriesView} from "@/features/stories/view";
import {buildMeta} from "@/lib/seo/meta";
import {getPageTitle, siteConfig} from "@/lib/site-config";

// No Review/AggregateRating JSON-LD by design — self-serving reviews are
// ineligible and ratings would invite claims (stories/page design).
export const Route = createFileRoute("/stories")({
  head: () =>
    buildMeta({
      title: getPageTitle("Customer stories"),
      description: `What customers in ${siteConfig.city} say about buying KEDI products from ${siteConfig.name}: the guidance, follow-up and service.`,
      path: "/stories",
    }),
  component: () => (
    <SiteLayout>
      <StoriesView />
    </SiteLayout>
  ),
});

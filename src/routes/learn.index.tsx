import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {LearnHubView} from "@/features/learn/view";
import {validateLearnSearch} from "@/features/learn/use-learn-topic";
import {buildMeta} from "@/lib/seo/meta";
import {getPageTitle, siteConfig} from "@/lib/site-config";

export const Route = createFileRoute("/learn/")({
  validateSearch: validateLearnSearch,
  head: () =>
    buildMeta({
      title: getPageTitle("Wellness Hub: practical health habits"),
      description: `Short, practical articles and videos on everyday wellness habits, from the ${siteConfig.name} team in ${siteConfig.city}.`,
      path: "/learn",
    }),
  component: () => (
    <SiteLayout>
      <LearnHubView />
    </SiteLayout>
  ),
});

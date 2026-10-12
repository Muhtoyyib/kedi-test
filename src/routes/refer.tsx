import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {ReferView} from "@/features/refer/view";
import {buildMeta} from "@/lib/seo/meta";
import {getPageTitle, siteConfig} from "@/lib/site-config";

export const Route = createFileRoute("/refer")({
  head: () =>
    buildMeta({
      title: getPageTitle("Refer a friend"),
      description: `Share your personal link. When a friend places their first order with ${siteConfig.name}, you both get a reward.`,
      path: "/refer",
    }),
  component: () => (
    <SiteLayout>
      <ReferView />
    </SiteLayout>
  ),
});

import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {HomeView} from "@/features/home/view";
import {buildMeta} from "@/lib/seo/meta";
import {siteConfig} from "@/lib/site-config";

// ≤ 60 chars: if the full title doesn't fit, drop "trusted" (page design).
function homeTitle(): string {
  const full = `${siteConfig.name} — Your trusted KEDI wellness partner in ${siteConfig.city}`;
  return full.length <= 60 ? full : `${siteConfig.name} — Your KEDI wellness partner in ${siteConfig.city}`;
}

export const Route = createFileRoute("/")({
  head: () => ({
    ...buildMeta({
      title: homeTitle(),
      description: `Genuine KEDI products in ${siteConfig.city} with free weekly wellness seminars, personal guidance and follow-up. Order easily on WhatsApp.`,
      path: "/",
    }),
  }),
  component: () => (
    <SiteLayout>
      <HomeView />
    </SiteLayout>
  ),
});

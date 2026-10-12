import {createFileRoute, notFound} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {LegalLayout} from "@/features/legal/legal-layout";
import {getLegalPage} from "@/lib/content/legal";
import {buildMeta} from "@/lib/seo/meta";
import {getPageTitle} from "@/lib/site-config";

const SLUG = "delivery-and-returns";

export const Route = createFileRoute("/delivery-and-returns")({
  head: async () => {
    const {getLegalPage: getPage} = await import("@/lib/content/legal");
    const page = getPage(SLUG);
    return buildMeta({
      title: getPageTitle(page?.title),
      description: page?.description ?? "",
      path: "/delivery-and-returns",
    });
  },
  component: function LegalPage() {
    const page = getLegalPage(SLUG);
    if (!page) throw notFound();
    return (
      <SiteLayout>
        <LegalLayout page={page} />
      </SiteLayout>
    );
  },
});

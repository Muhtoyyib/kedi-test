import {createFileRoute} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {getPageTitle, siteConfig, whatsappUrl} from "@/lib/site-config";

// Holding page until 10-add-home-page lands.
export const Route = createFileRoute("/")({
  head: () => ({meta: [{title: getPageTitle()}]}),
  component: HoldingPage,
});

function HoldingPage() {
  return (
    <SiteLayout className="px-4 py-16">
      <h1>{siteConfig.name}</h1>
      <p>Our new website is on the way. Chat with us on WhatsApp to order.</p>
      <a href={whatsappUrl()}>Chat on WhatsApp</a>
    </SiteLayout>
  );
}

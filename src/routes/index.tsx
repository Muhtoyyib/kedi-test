import {createFileRoute} from "@tanstack/react-router";
import {getPageTitle, siteConfig, whatsappUrl} from "@/lib/site-config";

// Holding page until 10-add-home-page lands.
export const Route = createFileRoute("/")({
  head: () => ({meta: [{title: getPageTitle()}]}),
  component: HoldingPage,
});

function HoldingPage() {
  return (
    <main>
      <h1>{siteConfig.name}</h1>
      <p>Our new website is on the way. Chat with us on WhatsApp to order.</p>
      <a href={whatsappUrl()}>Chat on WhatsApp</a>
    </main>
  );
}

import {createFileRoute, notFound} from "@tanstack/react-router";
import {SiteLayout} from "@/components/layout/site/layout";
import {getThankYouVariant} from "@/features/thank-you/variants";
import {ThankYouLayout} from "@/features/thank-you/thank-you-layout";
import {buildMeta} from "@/lib/seo/meta";
import {getPageTitle} from "@/lib/site-config";

export const Route = createFileRoute("/thank-you/$kind")({
  head: ({params}) => {
    const variant = getThankYouVariant(params.kind);
    return buildMeta({
      title: getPageTitle(variant?.title ?? "Thank you"),
      description: variant?.message ?? "",
      path: `/thank-you/${params.kind}`,
      noindex: true,
    });
  },
  loader: ({params}) => {
    // Validate the kind up front — component throws surface as errors, not
    // the not-found page, in this router version.
    if (!getThankYouVariant(params.kind)) throw notFound();
    return null;
  },
  component: function ThankYouPage() {
    const {kind} = Route.useParams();
    const variant = getThankYouVariant(kind);
    if (!variant) throw notFound();
    return (
      <SiteLayout>
        <ThankYouLayout {...variant} />
      </SiteLayout>
    );
  },
});

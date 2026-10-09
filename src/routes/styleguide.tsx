import {createFileRoute, notFound} from "@tanstack/react-router";
import {getPageTitle} from "@/lib/site-config";
import {StyleguidePage} from "@/features/styleguide/view";

// Development-only reference for tokens and primitives. Not in the prerender
// list or sitemap; renders the not-found page in production builds.
export const Route = createFileRoute("/styleguide")({
  beforeLoad: () => {
    if (import.meta.env.PROD) throw notFound();
  },
  head: () => ({meta: [{title: getPageTitle("Style guide")}, {name: "robots", content: "noindex"}]}),
  component: StyleguidePage,
});

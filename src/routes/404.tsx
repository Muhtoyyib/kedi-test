import {createFileRoute} from "@tanstack/react-router";
import {NotFound} from "@/components/not-found";
import {getPageTitle} from "@/lib/site-config";

// Exists only so the prerenderer can emit the not-found page;
// scripts/write-404.ts moves it to dist/client/404.html for wrangler.
export const Route = createFileRoute("/404")({
  head: () => ({meta: [{title: getPageTitle("Page not found")}, {name: "robots", content: "noindex"}]}),
  component: NotFound,
});

import {createFileRoute} from "@tanstack/react-router";
import {buildRobotsTxt} from "@/lib/seo/sitemap";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => new Response(buildRobotsTxt(), {headers: {"Content-Type": "text/plain"}}),
    },
  },
});

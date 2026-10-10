import {createFileRoute} from "@tanstack/react-router";
import {catalog} from "@/lib/catalog/data";
import {buildSitemapXml} from "@/lib/seo/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemapXml(catalog), {
          headers: {"Content-Type": "application/xml", "Cache-Control": "public, max-age=3600"},
        }),
    },
  },
});

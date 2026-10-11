import {createRootRoute, HeadContent, Outlet, Scripts} from "@tanstack/react-router";
import * as React from "react";
import appCss from "@/styles/app.css?url";
import fontUrl from "@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url";
import {AnalyticsBridge} from "@/components/analytics-bridge";
import {ReferralCapture} from "@/components/referral-capture";
import {jsonLdScripts, localBusinessLd, organizationLd, webSiteLd} from "@/lib/seo/jsonld";
import {siteConfig} from "@/lib/site-config";

export const Route = createRootRoute({
  head: ({matches}) => {
    const pathname = matches[matches.length - 1]?.pathname ?? "/";
    const canonical = siteConfig.url ? new URL(pathname, siteConfig.url).toString() : null;

    return {
      meta: [
        {charSet: "utf-8"},
        {name: "viewport", content: "width=device-width, initial-scale=1"},
        {name: "theme-color", content: "#317ABE"},
        {name: "robots", content: "index, follow"},
      ],
      links: [
        {rel: "icon", type: "image/svg+xml", href: "/favicon.svg"},
        {rel: "manifest", href: "/manifest.webmanifest"},
        {rel: "preload", as: "font", href: fontUrl, type: "font/woff2", crossOrigin: "anonymous"},
        {rel: "stylesheet", href: appCss},
        ...(canonical ? [{rel: "canonical", href: canonical}] : []),
      ],
      scripts: jsonLdScripts([organizationLd(), localBusinessLd(), webSiteLd()]),
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <AnalyticsBridge />
      <ReferralCapture />
    </RootDocument>
  );
}

function RootDocument({children}: {children: React.ReactNode}) {
  return (
    <html lang="en-NG">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

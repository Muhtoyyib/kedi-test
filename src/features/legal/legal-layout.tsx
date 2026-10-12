import type {ReactNode} from "react";
import type {LegalPage} from "@/lib/content/legal";
import {siteConfig} from "@/lib/site-config";
import {getMDXComponents} from "@/components/mdx-components";
import {SiteSection} from "@/components/marketing/site-section";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {Prose} from "@/components/ui/prose";

const updatedFormat = new Intl.DateTimeFormat("en-GB", {day: "numeric", month: "long", year: "numeric"});

// Shared chrome for the four legal pages (legal/layout design): breadcrumbs,
// title, last-updated date, h2 table of contents (collapsible on mobile),
// prose body and the contact close.
export function LegalLayout({page}: {page: LegalPage}) {
  const toc = page.toc.filter((item) => item.depth === 2);
  const Body = page.body;
  return (
    <SiteSection spacing="tight">
      <div className="max-w-3xl">
        <Breadcrumbs items={[{label: "Home", href: "/"}, {label: page.title}]} />
        <h1 className="mt-4 text-h1 font-extrabold text-text-heading md:text-h1-md">{page.title}</h1>
        <p className="mt-2 text-sm text-text-muted">Last updated {updatedFormat.format(new Date(page.updated))}</p>
        {toc.length > 0 ? <TocList items={toc} /> : null}
        <Prose className="mt-8">
          <Body components={getMDXComponents()} />
        </Prose>
        <p className="mt-10 border-t border-line pt-6 text-base text-text-body">
          Questions about this page?{" "}
          <a href="/contact" className="font-semibold text-brand-strong underline underline-offset-2">
            Contact us
          </a>{" "}
          or email{" "}
          <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-strong underline underline-offset-2">
            {siteConfig.email}
          </a>
          .
        </p>
      </div>
    </SiteSection>
  );
}

function TocList({items}: {items: {title: ReactNode; url: string}[]}) {
  const list = (
    <ul className="space-y-1.5 text-sm">
      {items.map((item) => (
        <li key={item.url}>
          <a href={item.url} className="text-brand-strong hover:underline">
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      <details className="mt-6 rounded-card bg-surface p-4 md:hidden">
        <summary className="cursor-pointer text-sm font-semibold text-text-heading">On this page</summary>
        <nav aria-label="On this page" className="mt-3">
          {list}
        </nav>
      </details>
      <nav aria-label="On this page" className="mt-6 rounded-card bg-surface p-4 max-md:hidden">
        <p className="text-sm font-semibold text-text-heading">On this page</p>
        <div className="mt-3">{list}</div>
      </nav>
    </>
  );
}

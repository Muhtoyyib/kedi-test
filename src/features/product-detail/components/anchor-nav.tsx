import {cn} from "cn";

const LINKS = [
  {href: "#about", label: "About"},
  {href: "#how-to-use", label: "How to use"},
  {href: "#facts", label: "Facts"},
  {href: "#faqs", label: "FAQs"},
] as const;

// In-page nav, md+ only, sticky under the header.
export function AnchorNav({className}: {className?: string}) {
  return (
    <nav aria-label="On this page" className={cn("max-md:hidden", className)}>
      <ul className="flex gap-6 border-b border-line text-sm font-semibold">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} className="inline-block border-b-2 border-transparent py-3 text-text-muted hover:text-ink">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

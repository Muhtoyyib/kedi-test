import {cn} from "cn";
import {isNavActive, primaryNav} from "@/lib/site-nav";

// Desktop nav, ≥1024px. The active section gets brand text plus a sun
// underline bar and aria-current (sections/02-header).
export function DesktopNav({pathname}: {pathname: string}) {
  return (
    <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
      {primaryNav.map((link) => {
        const active = isNavActive(link.href, pathname);
        return (
          <a
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn("relative py-1 text-base font-semibold hover:text-brand-strong", active ? "text-brand-strong" : "text-ink")}
          >
            {link.label}
            {active ? <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-1 rounded-full bg-sun" /> : null}
          </a>
        );
      })}
    </nav>
  );
}

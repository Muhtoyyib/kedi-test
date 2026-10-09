import {cn} from "cn";
import {ChevronRight} from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({items, className}: {items: BreadcrumbItem[]; className?: string}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? <ChevronRight className="size-4 text-text-muted" aria-hidden="true" /> : null}
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className={cn(isLast ? "font-medium text-ink" : "text-text-muted")}>
                  {item.label}
                </span>
              ) : (
                // hrefs can target routes not yet in the type map, so a plain anchor
                <a href={item.href} className="text-brand-strong hover:underline">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import type {Category} from "@/lib/catalog/types";
import {Breadcrumbs} from "@/components/ui/breadcrumbs";
import {ResponsiveImage} from "@/components/ui/responsive-image";
import {SiteSection} from "@/components/marketing/site-section";

export function CategoryHeader({category, count}: {category: Category; count: number}) {
  return (
    <SiteSection tone="brand-soft" spacing="tight">
      <Breadcrumbs items={[{label: "Home", href: "/"}, {label: "Shop", href: "/shop"}, {label: category.name}]} />
      <div className="mt-4 md:grid md:grid-cols-2 md:items-center md:gap-10">
        <div>
          <h1 className="text-h1 text-text-heading md:text-h1-md">{category.name}</h1>
          <p className="mt-3 text-lead text-text-body">{category.description}</p>
          <p className="mt-3 text-sm text-text-muted">{count} products</p>
        </div>
        {category.image ? (
          <ResponsiveImage image={category.image} sizes="(min-width:768px) 45vw" className="hidden aspect-4/3 rounded-card md:block" />
        ) : null}
      </div>
    </SiteSection>
  );
}
